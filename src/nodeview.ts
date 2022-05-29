import type { Node } from "prosemirror-model";
import type { NodeView, EditorView } from "prosemirror-view";
import type { SvelteComponent } from "svelte";
import type { EditorState, Transaction } from "prosemirror-state";

function supressMissingPropWarnings(props: { [key: string]: unknown }, fn: () => void) {
  const re = new RegExp(`was created with unknown prop '(${Object.keys(props).join('|')})'`);
  const _warn = console.warn;
  console.warn = (message?: unknown, ...optionalParams: unknown[]) =>
    !(typeof message === 'string' && re.test(message))
    &&  _warn(message, ...optionalParams);
  fn();
  console.warn = _warn;
}

interface IComponentOptions<Props extends Record<string, unknown> = Record<string, unknown>> {
  target: Element | ShadowRoot;
  anchor?: Element;
  props?: Props;
  context?: Map<unknown, unknown>;
  hydrate?: boolean;
  intro?: boolean;
  $$inline?: boolean;
}

export interface SvelteNodeViewControls {
  delete: () => void;
  update: (cb: (editorState: EditorState, node?: Node, getPos?: () => number) => Transaction) => void;
}

type Attrs = Record<string, unknown>;

type ComponentProps = {
  attrs?: Attrs;
  controls?: SvelteNodeViewControls,
  contentDOM?: (node: HTMLElement) => void,
  rootDOM?: (node: HTMLElement) => void,
}

export type SvelteComponentConstructor = new (options: IComponentOptions<ComponentProps>) => SvelteComponent;

type Options = {
  name: string;
}

export function createSvelteNodeView(constructor: SvelteComponentConstructor, options: Options) {
  return (node: Node, view: EditorView, getPos: () => number): NodeView =>
    new SvelteNodeView(constructor, options, node, view, getPos);
}

export default class SvelteNodeView implements NodeView {

  dom: HTMLElement;
  contentDOM: HTMLElement;
  component: SvelteComponent;
  view: EditorView;
  node: Node;
  innerContent: string;
  isComponentUpdating: boolean;
  getPos: () => number;
  unbind: () => void;

  constructor(constructor: SvelteComponentConstructor, options: Options, node: Node, view: EditorView, getPos: () => number) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    const target = document.createElement('div');

    const props = {
      attrs: node.attrs,
      contentDOM:  (node: HTMLElement) => this.contentDOM = node,
      rootDOM: (node: HTMLElement) => this.dom = node,
      view,
      controls: {
        delete: () => this.deleteNode(),
        update: (cb) => {
          const tr = cb(this.view.state, node, getPos);
          this.view.dispatch(tr);
        }
      }
    };

    supressMissingPropWarnings(props, () => {
      this.component = new constructor({ target, props });
    });

    this.component.$$.before_update.push(() => this.isComponentUpdating = true);
    this.component.$$.after_update.push(() => {
      window.setTimeout(() => this.isComponentUpdating = false);
    });

    this.dom = this.dom ?? target;

    this.dom.classList.add('svelte-node-view');
    this.dom.classList.add(`svelte-node-view--${options.name}`);

    const bindCallback = (attrs: Attrs) => {
      this.node.attrs = attrs;
      const transaction = view.state.tr.setNodeMarkup(getPos(), null, attrs);
      view.dispatch(transaction);
    };

    const index = this.component.$$.props['attrs'];
    this.component.$$.bound[index] = bindCallback;
  }

  deleteNode() {
    const transaction = this.view.state.tr.delete(this.getPos(), this.getPos() + 1);
    this.view.dispatch(transaction);
  }

  ignoreMutation: NodeView['ignoreMutation'] = m =>  {
    if (m.type === 'attributes') return true;

    // ignore the mutation if the component is updating
    // as these will (hopefully) be svelte
    if (this.isComponentUpdating) return true;

    // ignore all mutations that happen within contenteditable=false nodes
    // as these can't come from user input are also (hopefully) svelte
    const mutationIsInCeFalse = Array
    .from(this.dom.querySelectorAll('[contenteditable=false]'))
    .find(e => m.target == e || e.contains(m.target));
    if (mutationIsInCeFalse) return true;

    // let prosemirror handle the rest, including mutations outside of the contentDOM.
    return false;
  }

  stopEvent(e: Event) {
    if (e instanceof DragEvent) {
      return false;
    }
    return true;
  }

}

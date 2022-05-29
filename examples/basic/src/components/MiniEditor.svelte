<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { DOMParser, DOMSerializer, Node, Schema } from 'prosemirror-model';
  import { EditorState } from 'prosemirror-state';
  import { EditorView } from 'prosemirror-view';
  import { exampleSetup } from "prosemirror-example-setup";

  export let content: string;
  export let view: EditorView | null = null;
  export let placeholder = '';

  const dispatch = createEventDispatcher<{complete: null}>();

  const schema = new Schema({
    nodes: {
      doc: { content: 'span' },
      span: {
        content: 'inline*',
        parseDOM: [{ tag: 'span' }],
        toDOM: () => ['span', 0]
      },
      text: { group: 'inline' },
    },
    marks: {
      strong: {
        parseDOM: [ { tag: 'strong' } ],
        toDOM: () => ['strong', 0]
      },
    }
  });

  let editor: HTMLDivElement = null;
  const serializer = DOMSerializer.fromSchema(schema);
  const d = document.createElement('div');

  const htmlToNode = (html: string) => {
    d.innerHTML = html;
    return DOMParser.fromSchema(schema).parse(d);
  };

  const docToHTML = (node: Node) => {
    if (node.textContent.length === 0) return '';
    const span = node.maybeChild(0);
    const el = serializer.serializeNode(span);
    return el instanceof HTMLElement ? el.innerHTML : '';
  };

  let editorState = EditorState.create({
    schema,
    doc: htmlToNode(content || ''),
    plugins: exampleSetup({schema, menuBar: false})
  });

  $: content = docToHTML(editorState.doc);

  onMount(() => {
    view = new EditorView(
      { mount: editor },
      {
        state: editorState,
        dispatchTransaction: tr => {
          if (view) {
            editorState = view.state.apply(tr);
            view.updateState(editorState);
          }
        },
        handleDOMEvents: {
          keydown: (_, e) => e.key === 'Enter' && dispatch('complete')
        },
      }
    );
    view.focus();
  });

  onDestroy(() => view?.destroy());

</script>

<div
  class="mini-editor"
  data-placeholder={placeholder}
  bind:this={editor}
/>

<style lang="scss">

  .mini-editor {
    --ui-color-placeholder: #aaaaaa;
    position: relative;
    word-wrap: break-word;
    white-space: pre-wrap;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;

    &:global(.ProseMirror-hideselection *::selection) {
      background: transparent;
    }
    &:global(.ProseMirror-hideselection *::-moz-selection) {
      background: transparent;
    }
    &:global(.ProseMirror-hideselection) {
      caret-color: transparent;
    }
    &:global(.ProseMirror-selectednode) {
      outline: 2px solid #8cf;
    }
    &:global(.ProseMirror .empty-node::before) {
      position: absolute;
      color: #aaa;
      cursor: text;
    }
    &:global(.ProseMirror .empty-node:hover::before) {
      color: #777;
    }
    &:global(.ProseMirror-empty::before) {
      position: absolute;
      content: attr(data-placeholder);
      pointer-events: none;
      color: var(--ui-color-placeholder);
    }
  }


</style>

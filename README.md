# prosemirror-svelte-nodeview

Create a ProseMirror NodeView using Svelte.

## Basic usage

A basic heading NodeView (SimpleHeadingView)

```svelte
<script lang="ts">
  export var attrs: { level: number };
  export let contentDOM:  (node: HTMLElement) => void;

  $: tag = `h${attrs.level}`;

</script>

<svelte:element this={tag} use:contentDOM />
```

Loading the component using the plugin

```ts

EditorState.create({
  doc,
  plugins: [
    sveltePlugin({
      nodes: {
        heading: SimpleHeadingView,
      }
    })
  ]
})
```

## Component props

These props are passed to the components loaded into this plugin.

```ts
type ComponentProps = {
  attrs?: Record<string, unknown>;
  controls?: SvelteNodeViewControls,
  contentDOM?: (node: HTMLElement) => void,
  rootDOM?: (node: HTMLElement) => void,
}

export interface SvelteNodeViewControls {
  delete: () => void;
  update: (cb: (editorState: EditorState, node?: Node, getPos?: () => number) => Transaction) => void;
}
```

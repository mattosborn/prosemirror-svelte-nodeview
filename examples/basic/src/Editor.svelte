<script lang="ts">
  import { onMount } from "svelte";
  import { EditorState } from "prosemirror-state";
  import { EditorView } from "prosemirror-view";
  import { Schema, DOMParser } from "prosemirror-model";
  import * as basicSchema from "prosemirror-schema-basic";
  import { exampleSetup } from "prosemirror-example-setup";
  import { svelteNodeViewPlugin } from 'prosemirror-svelte-nodeview';
  import "prosemirror-example-setup/style/style.css";
  import "prosemirror-menu/style/menu.css";
  import HeadingView from "./nodeviews/HeadingView.svelte";

  let editorEl: HTMLElement;

  const schema = new Schema({
    nodes: {
      ...basicSchema.nodes,
      heading: {
        ...basicSchema.nodes.heading,
        attrs: { level: { default: 1 }, tooltip: { default: "" } }
      }
    },
    marks: basicSchema.marks
  });

  onMount(() => {
    let state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(editorEl),
      plugins: [
        ...exampleSetup({schema}),
        svelteNodeViewPlugin({
          nodes: {
            heading: HeadingView,
          }
        })
      ]
    })
    const view = new EditorView(
      { mount: editorEl },
      {
        state,
        dispatchTransaction: (transaction) => {
          if (view) {
            state = view.state.apply(transaction);
            view.updateState(state);
          }
        },
      }
    );

  });

</script>

<div class="ProseMirror ProseMirror-example-setup-style" bind:this={editorEl}>
  <slot />
</div>

<style>

  .ProseMirror {
    padding: 4px 8px 4px 14px
  }

</style>

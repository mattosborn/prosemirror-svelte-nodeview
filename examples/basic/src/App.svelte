<script lang="ts">
  import Editor from "./Editor.svelte";
</script>


<div class="container">

  <h1>prosemirror-svelte-nodeview</h1>
  <Editor>
    <h1>HeadingView</h1>
    <p>This is an example NodeView component written in Svelte that adds a tooltip to headings and uses a nested ProseMirror instance to edit it.</p>
  </Editor>

</div>

<style>
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  h1 {
    margin-bottom: 40px;
  }
</style>

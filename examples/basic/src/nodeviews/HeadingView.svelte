<script lang="ts">
  import IconButton from "../components/IconButton.svelte";
  import MiniEditor from "../components/MiniEditor.svelte";
  import { clickOutside } from "../util";

  export var attrs: { level: number, tooltip: string };
  export let contentDOM:  (node: HTMLElement) => void;

  let expanded = false;

  $: tag = `h${attrs.level}`;
  $: hasTooltip = attrs.tooltip.length > 0;
  $: tooltip = attrs.tooltip || 'Click to <b>edit tooltip</b>...';

</script>

<div class="hv" class:expanded>

  <svelte:element class="heading" this={tag} use:contentDOM />

  <div class="hv-controls" contenteditable="false" use:clickOutside={() => expanded = false} class:hasTooltip>
    <IconButton icon="info" on:click={() => expanded = !expanded} title={tooltip} />
    <div class="mini-editor-container">
      <MiniEditor
        bind:content={attrs.tooltip}
        on:complete={() => expanded = false}
        placeholder="Tooltip text..."
      />
    </div>
  </div>

</div>

<style lang="scss">
  .hv {
    caret-color: black;
    margin-top: 10px;
    display: flex;
    align-items: baseline;
  }
  .heading {
    margin: 0;
  }
  .hv :global(*:focus) {
    outline: none;
  }

  .mini-editor-container {
    border: 1px solid #777;
    min-width: 200px;
    font-size: 16px;
    line-height: 20px;
    .hv:not(.expanded) & {
      display: none;
    }
  }

  .hv-controls {
    position: relative;
    display: inline-flex;
    align-items: center;
    color: black;
    --ib-color: grey;
    &.hasTooltip {
      --ib-color: #1383de;
    }
  }
</style>


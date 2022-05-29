<script lang="ts">
  export let text: string = null;
</script>

<div class="tooltip">
  {@html text}
</div>

<style lang="scss">

  .tooltip {
    --arrow-size: 8px;
    --ib-tooltip-bg: #fafafa;
    --ib-tooltip-border: #49499276;
    position: absolute;
    z-index: 10;
    bottom: calc(100%);
    left: 50%;
    pointer-events: none;
    filter: drop-shadow(0px 1px 3px #00000044);
    font-size: 13px;
    line-height: 16px;
    max-width: 150px;
    white-space: normal;
    color: black;
    text-align: center;
    background: var(--ib-tooltip-bg);
    width: max-content;
    outline: none;
    opacity: 1;
    transition: all 80ms;
    padding: 8px;
    transform: translateX(-50%);

    :global(.tooltip-hover-el:not(:hover)) & {
      opacity: 0;
      visibility: hidden;
      transform: translateX(-50%) translateY(50%);
      transition: all 80ms;
    }
  }

</style>

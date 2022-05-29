<script lang="ts">
  import Tooltip from "./Tooltip.svelte";

  export let active = false;
  export let disabled = false;
  export let title: string = null;
  export let icon: string = null;
</script>

<div class="icon-button-container tooltip-hover-el" data-id={icon} >
  {#if title}
    <Tooltip text={title} />
  {/if}
  <button
      class:material-icons={icon}
      class="icon-button"
      on:click
      on:mousedown={(e) => e.preventDefault()}
      {disabled}
      class:active
      data-icon={icon}
      data-title={title}
  />
</div>

<style lang="scss">
  .icon-button-container {
    position: relative;
  }
  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    column-gap: 5px;
    background: var(--ib-bg, transparent);
    text-align: center;
    color: var(--ib-color, #333);
    border: 1px solid transparent;
    box-sizing: border-box;
    padding: 0;
    border-radius: 3px;
    height: var(--ib-size, 2rem);
    min-width: var(--ib-size, 2rem);

    &:not(:disabled):hover {
      text-decoration: none;
    }

    &[data-icon]::before {
      content: attr(data-icon);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Material Icons';
      font-size: var(--ib-icon-size, 1rem);
      width: var(--ib-size, 2rem);
      height: var(--ib-size, 2rem);
      background-color: var(--ib-icon-bg);
      border-radius: 3px;
    }

    &.active {
      background: var(--ib-active-bg);
      border: var(--ib-active-border);
    }

    &:not(:disabled) {
      cursor: pointer;
      &:hover {
        &:not(.active) {
          &[data-icon]::before {
            filter: var(--ib-hover-filter);
          }
          color: var(--ib-hover-color, var(--ib-color));
          background: var(--ib-hover-bg, var(--ib-bg));
          border: var(--ib-hover-border, 1px solid transparent);

          &[data-icon]::before {
            background-color: var(--ib-hover-icon-bg, var(--ib-icon-bg));
          }
        }
      }
    }

    &:disabled {
      opacity: 0.5;

    }
  }

</style>

<script lang="ts">
  export var attrs: { level: number };
  export let contentDOM:  (node: HTMLElement) => void;

  $: tag = `h${attrs.level}`;

</script>

<svelte:element this={tag} use:contentDOM />

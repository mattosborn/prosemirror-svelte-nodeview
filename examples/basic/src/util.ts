export function clickOutside(node: HTMLElement, fn: () => void) {
  const handleClick = (e: MouseEvent) => {
    if (!node.contains(e.target as Node)) {
      fn();
    }
  };
  document.addEventListener("click", handleClick, true);
  return {
    destroy: () => document.removeEventListener("click", handleClick, true)
  };
};
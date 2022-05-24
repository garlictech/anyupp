export const visibleLinesOnViewport = (element?: HTMLElement) => {
  if (!element) {
    return 0;
  }

  const itemSize: number = +(
    element.attributes.getNamedItem('itemsize')?.value || 50
  );
  const buffer = 3;

  return Math.ceil((element.clientHeight || 0) / itemSize) + buffer;
};

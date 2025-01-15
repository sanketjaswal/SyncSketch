import { getElementAtPosition, getResizeHandleAtPosition, resizeElement } from "./resize";

//CHECT TRIANGLE
export const isPointInTriangle = (px, py, vertices) => {
  const [A, B, C] = vertices;

  const area = (x1, y1, x2, y2, x3, y3) =>
    Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);

  const totalArea = area(A[0], A[1], B[0], B[1], C[0], C[1]);
  const area1 = area(px, py, B[0], B[1], C[0], C[1]);
  const area2 = area(A[0], A[1], px, py, C[0], C[1]);
  const area3 = area(A[0], A[1], B[0], B[1], px, py);

  return totalArea === area1 + area2 + area3;
};

// SELECT ELEMENT :- MOUSE DOWN
export const selectElement = (
  elements,
  offsetX,
  offsetY,
  ctxRef,
  setSelectedElement,
  setElements,
  setResizeHandle
) => {
  const elementIndex = getElementAtPosition(offsetX, offsetY, elements, ctxRef);

  //no element found
  if (elementIndex === null) {
    console.log("No element found.");
    return;
  }

  // Remove element from current place
  const [topElement] = elements.splice(elementIndex, 1);

  const diffX = offsetX - topElement.offsetX;
  const diffY = offsetY - topElement.offsetY;

  setSelectedElement({ ...topElement, diffX, diffY });

  // Add it to topmost place
  setElements((prevElements) => [...prevElements, topElement]);

  // resizing handle

  setResizeHandle(
    getResizeHandleAtPosition(offsetX, offsetY, {
      ...topElement,
      diffX,
      diffY,
    }) || null
  );
};

// RESIZE / MOVE ELEMENT :-  MOUSE MOVE
export const moveOrResizeElement = (resizeHandle, currentElement, offsetX, offsetY, selectedElement) => {
    if (resizeHandle) {
        resizeElement(currentElement, resizeHandle, offsetX, offsetY);
      } else {
        const { diffX, diffY } = selectedElement;

        // Update the position of the selected element
        const dy = offsetY - diffY;
        const dx = offsetX - diffX;

        currentElement.offsetX = dx;
        currentElement.offsetY = dy;

      }
}
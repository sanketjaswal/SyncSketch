import { getElementAtPosition, getResizeHandleAtPosition, resizeElement } from "./resize";



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

  if (elementIndex === null) {
    console.log("No element found.");
    return;
  }

  
  const [topElement] = elements.splice(elementIndex, 1);
  console.log("Element found:", topElement);
  const diffX = offsetX - topElement.offsetX;
  const diffY = offsetY - topElement.offsetY;

  setSelectedElement({ ...topElement, diffX, diffY });
  // add on the top of the stack
  setElements((prevElements) => [...prevElements, topElement]);
  setResizeHandle(
    getResizeHandleAtPosition(offsetX, offsetY, {
      ...topElement,
      diffX,
      diffY,
    }) || null
  );
};


// RESIZE / MOVE ELEMENT :-  MOUSE MOVE
export const moveOrResizeElement = (resizeHandle, currentElement, offsetX, offsetY, selectedElement, ctxRef) => {
  if (resizeHandle) {
    resizeElement(currentElement, resizeHandle, offsetX, offsetY, ctxRef);
  } else {
    const { diffX, diffY } = selectedElement;
    currentElement.offsetX = offsetX - diffX;
    currentElement.offsetY = offsetY - diffY;
  }
};
//CHECK SELECT TRIANGLE
export const isPointInTriangle = (px, py, points) => {
  const [A, B, C] = points; // Points of the triangle
  const area = (ax, ay, bx, by, cx, cy) => 
    Math.abs((ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) / 2);

  const totalArea = area(...A, ...B, ...C);
  const area1 = area(px, py, ...B, ...C);
  const area2 = area(...A, px, py, ...C);
  const area3 = area(...A, ...B, px, py);

  return totalArea === area1 + area2 + area3;
};
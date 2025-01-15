// GET ELEMENT AT MOUSE POSITION
export const getElementAtPosition = (x, y, elements, ctxRef) => {
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];
    if (element.type === "rect") {
      if (
        x >= element.offsetX &&
        x <= element.offsetX + element.width &&
        y >= element.offsetY &&
        y <= element.offsetY + element.height
      ) {
        return i;
      }
    } else if (element.type === "circle") {
      const dist = Math.sqrt(
        Math.pow(x - element.offsetX, 2) + Math.pow(y - element.offsetY, 2)
      );
      if (dist <= Math.abs(element.width / 2)) {
        return i;
      }
    } else if (element.type === "line") {
      if (
        x >= Math.min(element.offsetX, element.width) &&
        x <= Math.max(element.offsetX, element.width) &&
        y >= Math.min(element.offsetY, element.height) &&
        y <= Math.max(element.offsetY, element.height)
      ) {
        return i;
      }
      // } else if (element.type === "triangle") {
      //   if (isPointInTriangle(x, y, element.points)) {
      //     return i;
      //   }
    } else if (element.type === "text") {
      const textWidth = ctxRef.current.measureText(element.content).width;
      if (
        x >= element.offsetX &&
        x <= element.offsetX + textWidth &&
        y >= element.offsetY - 16 &&
        y <= element.offsetY
      ) {
        return i;
      }
    }
  }
  return null; // No element found
};

// DRAW RESIZE HANDLES
export const drawResizeHandles = (ctxRef, element) => {
  if (!element) return;

  const ctx = ctxRef.current;
  const { offsetX, offsetY, width, height } = element;
  const handleSize = 20; // Size of the resize handles

  const handles = [
    { x: offsetX, y: offsetY }, // Top-left
    { x: offsetX + width, y: offsetY }, // Top-right
    { x: offsetX, y: offsetY + height }, // Bottom-left
    { x: offsetX + width, y: offsetY + height }, // Bottom-right
  ];

  ctx.fillStyle = "red";

  handles.forEach(({ x, y }) => {
    ctx.fillRect(
      x - handleSize / 2,
      y - handleSize / 2,
      handleSize,
      handleSize
    );
  });
};

// GET SINGLE RESIZE HANDLE AT CORNOR
export const getResizeHandleAtPosition = (x, y, element) => {
  const { offsetX, offsetY, width, height } = element;
  const handleSize = 50;

  if (element.type === "triangle") {
    const handleSize = 10; // Resize handle size
    const vertices = element.points;

    for (let i = 0; i < vertices.length; i++) {
      const [vx, vy] = vertices[i];
      if (
        x >= vx - handleSize / 2 &&
        x <= vx + handleSize / 2 &&
        y >= vy - handleSize / 2 &&
        y <= vy + handleSize / 2
      ) {
        return `vertex-${i}`;
      }
    }
    return null;
  } else {
    const handles = [
      { x: offsetX, y: offsetY, name: "top-left" },
      { x: offsetX + width, y: offsetY, name: "top-right" },
      { x: offsetX, y: offsetY + height, name: "bottom-left" },
      { x: offsetX + width, y: offsetY + height, name: "bottom-right" },
    ];

    for (let handle of handles) {
      if (
        x >= handle.x - handleSize / 2 &&
        x <= handle.x + handleSize / 2 &&
        y >= handle.y - handleSize / 2 &&
        y <= handle.y + handleSize / 2
      ) {
        return handle.name;
      }
    }

    return null;
  }
};

// RESIZE ELEMENT and CURSOR CHANGE
export const resizeElement = (
  currentElement,
  resizeHandle,
  offsetX,
  offsetY
) => {
  if (resizeHandle == "top-left") {
    document.getElementsByClassName("drawing-canvas")[0].style.cursor =
      "url('https://img.icons8.com/windows/20/resize-diagonal--v2.png'), auto";
    currentElement.width += currentElement.offsetX - offsetX;
    currentElement.offsetX = offsetX;
    currentElement.height += currentElement.offsetY - offsetY;
    currentElement.offsetY = offsetY;
  } else if (resizeHandle == "top-right") {
    document.getElementsByClassName("drawing-canvas")[0].style.cursor =
      "url('https://img.icons8.com/ios-filled/20/000000/resize-diagonal.png'), auto";
    currentElement.width = offsetX - currentElement.offsetX;
    currentElement.height += currentElement.offsetY - offsetY;
    currentElement.offsetY = offsetY;
  } else if (resizeHandle == "bottom-left") {
    document.getElementsByClassName("drawing-canvas")[0].style.cursor =
      "url('https://img.icons8.com/ios-filled/20/000000/resize-diagonal.png'), auto";
    currentElement.width += currentElement.offsetX - offsetX;
    currentElement.offsetX = offsetX;
    currentElement.height = offsetY - currentElement.offsetY;
  } else if (resizeHandle == "bottom-right") {
    document.getElementsByClassName("drawing-canvas")[0].style.cursor =
      "url('https://img.icons8.com/windows/20/resize-diagonal--v2.png'), auto";
    currentElement.width = offsetX - currentElement.offsetX;
    currentElement.height = offsetY - currentElement.offsetY;
  }
};

// ON RESIZE - CHECK AND CORRECT :- IF ELEMENT HEIGHT/WIDTH IS NEGATIVE
export const elementOffsetCheck = (elements, setElements) => {
  let ele = elements[elements.length - 1];
  if (ele.width < 0) {
    ele.width = Math.abs(ele.width);
    ele.offsetX = ele.offsetX - ele.width;
  }
  if (ele.height < 0) {
    ele.height = Math.abs(ele.height);
    ele.offsetY = ele.offsetY - ele.height;
  }

  setElements((prevElements) => [...prevElements, ele]);
};

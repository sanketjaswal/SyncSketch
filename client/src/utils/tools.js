//Set ELEMENT FOUNDATION for TOOL :-// MOUSE DOWN
export const setElementBasics = (tool, element, offsetX, offsetY) => {
  switch (tool) {
    case "pencil":
      element.type = "pencil";
      element.path = [[offsetX, offsetY]];
      break;
    case "marker":
      element.type = "marker";
      element.path = [[offsetX, offsetY]];
      break;
    case "highlighter":
      element.type = "highlighter";
      element.path = [[offsetX, offsetY]];
      break;
    case "eraser":
      element.type = "eraser";
      element.stroke = "white";
      break;
    case "curve":
      element.type = "curve";
      element.points = [[offsetX, offsetY]];
      break;
    case "line":
      element.type = "line";
      element.width = offsetX;
      element.height = offsetY;
      break;
    case "rect":
      element.type = "rect";
      break;
    case "eclipse":
      element.type = "eclipse";
      break;
    case "polygon":
      element.type = "polygon";
      element.points = [[offsetX, offsetY]];
      break;
    case "triangle":
      element.type = "triangle";
      element.points = [[offsetX, offsetY]];
      break;
    case "circle":
      element.type = "circle";
      break;
    case "text": {
      const content = prompt("Enter your text:");
      if (content) {
        element.type = "text";
        element.content = content;
        element.fontSize = 16;
      }
      break;
    }
    default:
      break;
  }
  return element;
};

// Set ELEMENT PATH for TOOL :-// MOUSE MOVE
export const setElementPath = (tool, currentElement, offsetX, offsetY) => {
    switch (tool) {
        case "pencil":
        case "marker":
        case "highlighter":
        case "eraser":
          currentElement.path.push([offsetX, offsetY]);
          break;
        case "curve":
          currentElement.points.push([offsetX, offsetY]);
          break;
        case "line":
          currentElement.width = offsetX;
          currentElement.height = offsetY;
          break;
        case "rect":
        case "eclipse": {
          const dx = offsetX - currentElement.offsetX;
          const dy = offsetY - currentElement.offsetY;
          currentElement.width = dx;
          currentElement.height = dy;
          break;
        }

        case "polygon":
          currentElement.points.push([offsetX, offsetY]);
          break;

        case "triangle": {
          const startX = currentElement.points[0][0];
          const startY = currentElement.points[0][1];

          const vertex1 = [startX, startY];
          const vertex2 = [offsetX, offsetY];
          const vertex3 = [2 * startX - offsetX, offsetY];

          currentElement.points = [vertex1, vertex2, vertex3];
          break;
        }

        case "circle": {
          const d = Math.sqrt(
            Math.pow(offsetX - currentElement.offsetX, 2) +
              Math.pow(offsetY - currentElement.offsetY, 2)
          );
          currentElement.width = d * 2;
          break;
        }

        default:
          break;
      }
}
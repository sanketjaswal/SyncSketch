import { drawResizeHandles } from "./resize";

// DRAW ELEMENTS
export const drawElements = (
  canvasRef,
  ctxRef,
  rough,
  elements,
  selectedElement
) => {
  const canvas = canvasRef.current;
  const ctx = ctxRef.current;
  const roughCanvas = rough.canvas(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // console.log(elements)

  elements.forEach((element) => {
    if (element.style == null) {
      element.fill = "transparent";
    }
    // pencil
    if (element.type === "pencil" || element.type === "eraser") {
      roughCanvas.linearPath(element.path, {
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        roughness: element.roughness,
      });
    }
    //marker
    else if (element.type === "marker") {
      roughCanvas.linearPath(element.path, {
        roughness: 0.2,
        bowing: 0.1,
        strokeWidth: 3,
        stroke: "#ff8222",
      });
    }
    //highlighter
    else if (element.type === "highlighter") {
      roughCanvas.linearPath(element.path, {
        roughness: 0.2,
        bowing: 0.1,
        strokeWidth: 15,
        stroke: "rgba(255, 235, 59, 0.5)",
        fill: "rgba(255, 235, 59, 0.3)",
        fillStyle: "solid",
      });
    }
    // curve
    else if (element.type === "curve") {
      roughCanvas.curve(element.points, {
        // bowing: 10,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        roughness: element.roughness,
      });
    }
    // rectangle
    else if (element.type === "rect") {
      roughCanvas.rectangle(
        element.offsetX,
        element.offsetY,
        element.width,
        element.height,
        // 200,200
        {
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          roughness: element.roughness,
          fill: element.fill,
          fillStyle: element.style,
        }
      );
    }
    // star
    else if (element.type === "star") {
        roughCanvas.polygon(element.points, {
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          roughness: element.roughness,
          fill: element.fill,
          fillStyle: element.style,
        });
      }
    // line
    else if (element.type === "line") {
      roughCanvas.line(
        element.offsetX,
        element.offsetY,
        element.width,
        element.height,
        {
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          roughness: element.roughness,
        }
      );
    }
    // eclipse
    else if (element.type === "eclipse") {
      roughCanvas.ellipse(
        element.offsetX + element.width / 2,
        element.offsetY + element.height / 2,
        Math.abs(element.width),
        Math.abs(element.height),
        {
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          roughness: element.roughness,
          fill: element.fill,
          fillStyle: element.style,
        }
      );
    }
    // circle
    else if (element.type === "circle") {
      roughCanvas.circle(
        element.offsetX,
        element.offsetY,
        Math.abs(element.width),
        {
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          roughness: element.roughness,
          fill: element.fill,
          fillStyle: element.style,
        }
      );
    }
    // arc
    // else if (element.type === "arc") {
    //   roughCanvas.arc(
    //     element.offsetX,
    //     element.offsetY,
    //     element.width,
    //     element.height,
    //     element.startAngle,
    //     element.endAngle,
    //     {
    //       stroke: element.stroke,
    //       strokeWidth: element.strokeWidth,
    //       roughness: element.roughness,
    //       fill: element.fill,
    //       fillStyle: element.style,
    //     }
    //   );
    // }
    // polygon
    else if (element.type === "polygon") {
      roughCanvas.polygon(element.points, {
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        roughness: element.roughness,
        fill: element.fill,
        fillStyle: element.style,
      });
    }
    // triangle
    else if (element.type === "triangle") {
      roughCanvas.polygon(element.points, {
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        roughness: element.roughness,
        fill: element.fill,
        fillStyle: element.style,
      });
    }
    // Text
    else if (element.type === "text") {
      ctx.font = `${element.fontSize || 16}px Arial`;
      ctx.fillStyle = element.stroke || "black";
      ctx.fillText(element.content, element.offsetX, element.offsetY);
    }
  });

  if (selectedElement) {
    drawResizeHandles(selectedElement);
  }
};

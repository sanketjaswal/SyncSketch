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

  if (selectedElement) {
        drawResizeHandles(ctxRef, selectedElement);
      }

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
    // heart
    else if (element.type === "heart") {
      if (element.path && element.path.length > 0) {
        roughCanvas.polygon(element.path, {
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          roughness: element.roughness,
          fill: element.fill,
          fillStyle: element.style,
        });
      } else {
        // console.error("Heart path is undefined or empty:", element.path);
      }
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
    // spray
    else if (element.type === "spray") {
      element.dots.forEach((dot) => {
        roughCanvas.circle(dot.x, dot.y, dot.size, {
          fill: element.stroke,
          stroke: element.stroke,
          roughness: element.roughness,
        });
      });
    }
    // brush
    // else if (element.type === "brush") {
    //   // Draw each segment of the path
    //   ctx.globalAlpha = element.opacity || 1;
    //   element.path.forEach((point, index) => {
    //     if (index === 0) return;
    //     const [x1, y1] = element.path[index - 1];
    //     const [x2, y2] = point;

    //     roughCanvas.line(x1, y1, x2, y2, {
    //       stroke: element.stroke,
    //       strokeWidth: element.strokeWidth,
    //       roughness: element.roughness,
    //     });
    //   });
    // }
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

  
};

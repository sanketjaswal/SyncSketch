/* eslint-disable react/prop-types */
import rough from "roughjs";
import "./index.css";
import { useEffect, useState, useRef } from "react";

const roughGenerator = rough.generator();

const Whiteboard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  socket,
  fillColor,
  fillStyle,
  brushsize,
  roughness,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    socket.on("whiteboardDataResponse", (data) => {
      setElements(data.elements);
    });

    return () => {
      socket.off("whiteboardDataResponse");
    };
  }, [socket, setElements]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctxRef.current = ctx;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
    }
  }, [canvasRef, ctxRef]);

  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  const drawElements = (elements) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const roughCanvas = rough.canvas(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      if (element.style == null) {
        element.fill = "transparent";
      }
      if (element.type === "pencil" || element.type === "eraser") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          roughness: element.roughness,
        });
      } else if (element.type === "curve") {
        roughCanvas.curve(element.points, {
          bowing: 10,
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          roughness: element.roughness,
        });
      } else if (element.type === "rect") {
        roughCanvas.rectangle(
          element.offsetX,
          element.offsetY,
          element.width,
          element.height,
          {
            disableMultiStroke: true,
            stroke: element.stroke,
            strokeWidth: element.strokeWidth,
            roughness: element.roughness,
            fill: element.fill,
            fillStyle: element.style,
          }
        );
      } else if (element.type === "line") {
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
      } else if (element.type === "eclipse") {
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
      } else if (element.type === "circle") {
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
      } else if (element.type === "text") {
        ctx.font = `${element.fontSize || 16}px Arial`;
        ctx.fillStyle = element.stroke || "black";
        ctx.fillText(element.content, element.offsetX, element.offsetY);
      }
    });
  };

  useEffect(() => {
    drawElements(elements);
  }, [elements]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    const element = {
      offsetX,
      offsetY,
      stroke: color,
      strokeWidth: brushsize,
      roughness: roughness,
      fill: fillColor,
      style: fillStyle,
      width: 0,
      height: 0,
      points: [],
      path: [],
    };

    switch (tool) {
      case "pencil":
        element.type = "pencil";
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
      case "circle":
        element.type = "circle";
        break;
      case "text":
        const content = prompt("Enter your text:");
        if (content) {
          element.type = "text";
          element.content = content;
          element.fontSize = 16; // Default font size
        }
        break;
      default:
        break;
    }

    setElements((prevElements) => [...prevElements, element]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;

    setElements((prevElements) => {
      const updatedElements = [...prevElements];
      const lastElement = updatedElements[updatedElements.length - 1];

      if (lastElement) {
        switch (tool) {
          case "pencil":
          case "eraser":
            lastElement.path.push([offsetX, offsetY]);
            break;
          case "curve":
            lastElement.points.push([offsetX, offsetY]);
            break;
          case "line":
            lastElement.width = offsetX;
            lastElement.height = offsetY;
            break;
          case "rect":
          case "eclipse":
            const dx = offsetX - lastElement.offsetX;
            const dy = offsetY - lastElement.offsetY;
            lastElement.width = dx;
            lastElement.height = dy;
            break;
          case "circle":
            const d = Math.sqrt(
              Math.pow(offsetX - lastElement.offsetX, 2) +
                Math.pow(offsetY - lastElement.offsetY, 2)
            );
            lastElement.width = d * 2;
            break;
          default:
            break;
        }
      }

      return updatedElements;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    socket.emit("whiteboardData", { elements });
  };

  return (
    <div
      className="drawing-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas className="canvas" ref={canvasRef} />
    </div>
  );
};

export default Whiteboard;

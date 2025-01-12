/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useLayoutEffect } from "react";

import rough from "roughjs";
import { v4 as uuidv4 } from "uuid";

import "./index.css";

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
  const [selectedElement, setSelectedElement] = useState(null);

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
          stroke: "#ff8222" || element.stroke,
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
            disableMultiStroke: true,
            stroke: element.stroke,
            strokeWidth: element.strokeWidth,
            roughness: element.roughness,
            fill: element.fill,
            fillStyle: element.style,
          }
        );
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

  useEffect(() => {
    drawElements(elements);
  }, [elements, selectedElement]);
  
  // useLayoutEffect(()=>{
    
  //   if(elements){
  //     elementCheck();
  //   }
  // },[elements])
  
  // get selected elemnets poition
  const getElementAtPosition = (x, y) => {
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

  // draw resize handles
  const drawResizeHandles = (element) => {
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

    ctx.fillStyle = "blue";

    handles.forEach(({ x, y }) => {
      ctx.fillRect(
        x - handleSize / 2,
        y - handleSize / 2,
        handleSize,
        handleSize
      );
    });
  };

  const [resizeHandle, setResizeHandle] = useState(null);

  // get resize handle position
  const getResizeHandleAtPosition = (x, y, element) => {

    const { offsetX, offsetY, width, height } = element;
    const handleSize = 50;

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
  };

// element + / - check
  const elementCheck = () => {
    let ele = elements[elements.length -1]
    if(ele.width < 0){
      ele.width = Math.abs(ele.width)
      ele.offsetX = ele.offsetX - ele.width
      ele.stroke = "red"
    }
    if(ele.height < 0){
      ele.height = Math.abs(ele.height)
      ele.offsetY = ele.offsetY - ele.height
      ele.stroke = "red"
    }

    setElements((prevElements) => [...prevElements, ele]);
    console.log(ele)
  }

  // mouse down
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "select") {
      const elementIndex = getElementAtPosition(offsetX, offsetY);

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
      const handle = getResizeHandleAtPosition(
        offsetX,
        offsetY,
        selectedElement
      );
      console.log("handle " + handle);
      if (handle) {
        setResizeHandle(handle);
      }
    } else {
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
        startAngle: 0,
        endAngle: 0,
        points: [],
        path: [],
        uuid: uuidv4(),
      };

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
        case "circle":
          element.type = "circle";
          break;
        case "text":
          const content = prompt("Enter your text:");
          if (content) {
            element.type = "text";
            element.content = content;
            element.fontSize = 16;
          }
          break;
        default:
          break;
      }

      setElements((prevElements) => [...prevElements, element]);
    }
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (!isDrawing) return;

    setElements((prevElements) => {
      const updatedElements = [...prevElements];

      let currentElement = updatedElements[updatedElements.length - 1];

      if (tool === "select" && currentElement) {
        if (resizeHandle) {
          if (resizeHandle == "top-left") {
            // console.log("resizingHandle " + resizeHandle);
            document.getElementsByClassName("drawing-canvas")[0].style.cursor =
              "text";
              currentElement.width += currentElement.offsetX - offsetX;
              currentElement.offsetX = offsetX;
              currentElement.height += currentElement.offsetY - offsetY;
              currentElement.offsetY = offsetY;
          } else if (resizeHandle == "top-right") {
          } else if (resizeHandle == "bottom-left") {
          } else if (resizeHandle == "bottom-right") {
          }
        } else {
          console.log(currentElement);
          const { diffX, diffY } = selectedElement;

          // Update the position of the selected element
          const dy = offsetY - diffY;

          currentElement.offsetX = dx;
          currentElement.offsetY = dy;

          // console.log(currentElement.offsetX, currentElement.offsetY);
        }
        // drawElements(updatedElements);
      } else {
        if (currentElement) {
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
            case "eclipse":
              const dx = offsetX - currentElement.offsetX;
              const dy = offsetY - currentElement.offsetY;
              currentElement.width = dx;
              currentElement.height = dy;
              break;

            case "polygon":
              currentElement.points.push([offsetX, offsetY]);
              break;

            case "circle":
              const d = Math.sqrt(
                Math.pow(offsetX - currentElement.offsetX, 2) +
                  Math.pow(offsetY - currentElement.offsetY, 2)
              );
              currentElement.width = d * 2;
              break;

            default:
              break;
          }
          // currentElement = elementCheck(currentElement)

        }
      }

      return updatedElements;
    });
    console.log(elements[elements.length -1])
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    elementCheck();

    // setSelectedElement(null);
    socket.emit("whiteboardData", { elements });
  };

  return (
    <div
      className="drawing-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleTouchMove}
      // onTouchEnd={handleTouchEnd}
    >
      <canvas className="canvas" ref={canvasRef} />
    </div>
  );
};

export default Whiteboard;

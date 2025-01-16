/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import rough from "roughjs";
import { v4 as uuidv4 } from "uuid";

import "./index.css";
import { drawElements } from "../../utils/draw";
import { elementOffsetCheck } from "../../utils/resize";
import { setElementBasics, setElementPath } from "../../utils/tools";
import { moveOrResizeElement, selectElement } from "../../utils/selectTools";

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
  const [resizeHandle, setResizeHandle] = useState(null);

  //  WHITEBOARD RESPONSE DATA
  useEffect(() => {
    socket.on("whiteboardDataResponse", (data) => {
      setElements(data.elements);
    });

    return () => {
      socket.off("whiteboardDataResponse");
    };
  }, [socket, setElements]);

  // CANVAS REFERENCE DATA
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

  // COLOR STROKE
  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  // DRAW ELEMENTS
  useEffect(() => {
    drawElements(canvasRef, ctxRef, rough, elements, selectedElement);
  }, [elements, selectedElement]);

  // MOUSE DOWN EVENT
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "select") {
      // SELECT ELEMENT & SET RESIZE HANDLES
      selectElement(
        elements,
        offsetX,
        offsetY,
        ctxRef,
        setSelectedElement,
        setElements,
        setResizeHandle
      );
    } else {
      // SET NEW ELEMENT FOUNDATION
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
        dots: [],
        uuid: uuidv4(),
      };

      let newElement = setElementBasics(tool, element, offsetX, offsetY);
      setElements((prevElements) => [...prevElements, newElement]);
    }
    setIsDrawing(true);
  };

  // MOUSE MOVE EVENT
  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (!isDrawing) return;

    // SET ELEMENT
    setElements((prevElements) => {
      const updatedElements = [...prevElements];

      let currentElement = updatedElements[updatedElements.length - 1];

      if (tool === "select" && currentElement) {
        // MOVE / RESIZE ELEMENT
        moveOrResizeElement(
          resizeHandle,
          currentElement,
          offsetX,
          offsetY,
          selectedElement
        );
      } else {
        // SET ELEMENT PATH
        if (currentElement) {
          setElementPath(tool, currentElement, offsetX, offsetY);
        }
      }

      return updatedElements;
    });
  };

  //  MOUSE UP EVENT
  const handleMouseUp = () => {
    setIsDrawing(false);
    elementOffsetCheck(elements, setElements);
    setResizeHandle(null);

    // EMIT WHITEBOARD DATA
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

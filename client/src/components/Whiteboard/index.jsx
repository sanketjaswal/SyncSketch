/* eslint-disable react/prop-types */
import rough from "roughjs";
import "./index.css";
import { useEffect, useLayoutEffect, useState, useRef } from "react";

const roughGenerator = rough.generator();

const Whiteboard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  socket,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const requestRef = useRef(null);

  // Update the canvas based on drawing elements
  useEffect(() => {
    socket.on("whiteboardDataResponse", (data) => {
      setElements(data.elements); // Receive updated elements
    });

    return () => {
      socket.off("whiteboardDataResponse"); // Cleanup listener
    };
  }, [socket, setElements]);

  // Canvas initialization
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

  // Sync the color with the stroke style
  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  // Use requestAnimationFrame for smoother rendering
  const drawElements = (elements) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const roughCanvas = rough.canvas(canvas);

    // Clear the canvas only when drawing is done
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: 1,
          roughness: 0,
        });
      }else if (element.type === "eraser") {
        roughCanvas.linearPath(element.path, {
          stroke: "white",
          strokeWidth: 5,
          roughness: 0,
        });
      } else if (element.type === "rect") {
        roughCanvas.rectangle(
          element.offsetX,
          element.offsetY,
          element.width,
          element.height,
          { stroke: element.stroke, strokeWidth: 5, roughness: 0 }
        );
      } else if (element.type === "line") {
        roughCanvas.line(
          element.offsetX,
          element.offsetY,
          element.width,
          element.height,
          { stroke: element.stroke, strokeWidth: 1, roughness: 0 }
        );
      }
    });
  };

  // Handling drawing actions
  useEffect(() => {
    drawElements(elements);
  }, [elements]);

  const white = "#000000";

  // Handle drawing on mouse down
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    }else if (tool === "eraser") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "eraser",
          path: [[offsetX, offsetY]],
          stroke: white,
          // strokeWidth: 3
        },
      ]);
    } else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    } else if (tool === "rect") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "rect",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }

    setIsDrawing(true);
  };

  // Handle drawing on mouse move
  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(elements.filter((item)=> item.))

    setElements((prevElements) => {
      const updatedElements = [...prevElements];
      const lastElement = updatedElements[updatedElements.length - 1];

      if (lastElement) {
        if (tool === "pencil" && lastElement.type === "pencil") {
          lastElement.path.push([offsetX, offsetY]);
        } else if (tool === "eraser" && lastElement.type === "eraser") {
          lastElement.path.push([offsetX, offsetY]);
        } else if (tool === "line" && lastElement.type === "line") {
          lastElement.width = offsetX;
          lastElement.height = offsetY;
        } else if (tool === "rect" && lastElement.type === "rect") {
          lastElement.width = offsetX - lastElement.offsetX;
          lastElement.height = offsetY - lastElement.offsetY;
        }
      }

      return updatedElements;
    });

    // Continuously draw as the mouse moves
    // setCurrentPath((prevPath) => [...prevPath, [offsetX, offsetY]]);
    // socket.emit("whiteboardData", { elements });

    // sendToScoket(elements)
  };

  const sendToSocket = (elements) => {
    // console.log("sendtosocket");
    socket.emit("whiteboardData", { elements });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDrawing) {
        sendToSocket(elements);
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isDrawing]);

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDrawing(false);
    sendToSocket(elements);
  };

  return (
    <div
    className="drawing-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Whiteboard;

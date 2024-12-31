import { useEffect, useRef, useState } from "react";
import "./index.css";
import Whiteboard from "../../components/Whiteboard";
import { useParams } from "react-router-dom";

const RoomPage = ({ user, socket, users }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const { roomId } = useParams();
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [chatVisible, setChatVisible] = useState(false);

  // Handle clearing the canvas
  const handleClearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setElements([]);
    setHistory([]);
  };

  // Handle undo action
  const undo = () => {
    if (elements.length > 0) {
      const lastElement = elements[elements.length - 1];
      socket.emit("undo", lastElement);
      setHistory((prevHistory) => [...prevHistory, lastElement]);
      setElements((prevElements) => prevElements.slice(0, -1));
    }
  };

  // Handle redo action
  const redo = () => {
    if (history.length > 0) {
      const lastHistoryItem = history[history.length - 1];
      socket.emit("redo", lastHistoryItem);
      setElements((prevElements) => [...prevElements, lastHistoryItem]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  };

  useEffect(() => {
    console.log(users);
  }, [users]);

  // Toggle user chat visibility
  const toggleUserchat = () => {
    setChatVisible(!chatVisible);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="loggo">
          <span className="syncc">Sync</span>
          <span className="sketch">Sketch</span>
        </div>
      </header>

      <div className="below-header">
        <div className="controls controls-bar">
          <div className="control-item user-button" onClick={toggleUserchat}>
            <img
              className="menu-icon"
              src="https://img.icons8.com/?size=100&id=36389&format=png&color=ffffff"
              alt="User Menu Icon"
            />
            <h2>
              {users.length} Users Online</h2>
          </div>

          <div className="control-item">
            <label>
              Color Picker:
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
          </div>

          <div className="control-item">
            <div className="tools">
              <label>
                <input
                  type="radio"
                  name="tools"
                  value="pencil"
                  checked={tool === "pencil"}
                  onChange={() => setTool("pencil")}
                />
                Pencil
              </label>
              <label>
                <input
                  type="radio"
                  name="tools"
                  value="line"
                  checked={tool === "line"}
                  onChange={() => setTool("line")}
                />
                Line
              </label>
              <label>
                <input
                  type="radio"
                  name="tools"
                  value="rect"
                  checked={tool === "rect"}
                  onChange={() => setTool("rect")}
                />
                Rectangle
              </label>
            </div>
          </div>

          <div className="control-item">
            <button
              className="button"
              disabled={elements.length === 0}
              onClick={undo}
            >
              Undo
            </button>
            <button
              className="button"
              disabled={history.length < 1}
              onClick={redo}
            >
              Redo
            </button>
          </div>

          <div className="control-item">
            <button className="button clear" onClick={handleClearCanvas}>
              Clear Canvas
            </button>
          </div>
        </div>

        <div
          className={`user-chat ${
            chatVisible ? "chat-visible" : "chat-hidden"
          }`}
        >
          {users
            .filter((usr) => usr.roomId === roomId)
            .map((usr, index) => (
              <span key={index}>{usr.name}{user && user.userId === usr.userId && " (You)"}</span>
            ))}
        </div>

        <div className="canvas-container">
          <Whiteboard
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            elements={elements}
            setElements={setElements}
            tool={tool}
            color={color}
            socket={socket}
          />
        </div>
      </div>
    </div>
  );
};


export default RoomPage;

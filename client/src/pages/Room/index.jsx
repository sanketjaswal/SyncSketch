import { useEffect, useRef, useState } from "react";
import "./index.css";
import Whiteboard from "../../components/Whiteboard";
import { useParams } from "react-router-dom";
import brush from "../../assets/paintbrush.png";

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
          <img className="controls-bgi" src={brush}></img>
          <div className="control-item user-button" onClick={toggleUserchat}>
            <img
              className="menu-icon"
              src="https://img.icons8.com/?size=100&id=36389&format=png&color=ffffff"
              alt="User Menu Icon"
            />
            <h2>{users.length} Users Online</h2>
          </div>

          <div className="control-item paintHolder">
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/ios-filled/50/paint-brush.png"
              alt="paint-brush"
              id="paint-plate"
            />
            <input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                console.log(e.target.value);
              }}
            />
          </div>

          <div className="control-buttons">
            <div
              className="tool-btn"
              onClick={() => {
                setTool("eraser");
              }}
            >
              <img
                width="28"
                id="eraser"
                height="28"
                src="https://img.icons8.com/metro/26/eraser.png"
                alt="eraser"
              />
            </div>
            <div className="tool-btn" onClick={() => setTool("pencil")}>
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/external-itim2101-fill-itim2101/64/1A1A1A/external-pen-school-stationery-itim2101-fill-itim2101.png"
                alt="external-pen-school-stationery-itim2101-fill-itim2101"
              />
            </div>
            <div className="tool-btn" onClick={() => setTool("line")}>
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/ios/50/ruler.png"
                alt="ruler"
              />
            </div>
            <div className="tool-btn" onClick={() => setTool("rect")}>
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/material-outlined/24/rectangle-stroked.png"
                alt="rectangle-stroked"
              />
            </div>
            <div className="tool-btn"></div>
            <div className="tool-btn"></div>
          </div>

          <div className="control-item brush-div">
            <label>Brush Size :</label>
            <input
              type="range"
              min="1"
              max="100"
              class="slider"
              id="myRange"
            ></input>
          </div>

          <div className="control-item">
            <button
              className="button"
              disabled={elements.length === 0}
              onClick={undo}
            >
<img width="30" height="30" src="https://img.icons8.com/ios-filled/50/undo.png" alt="undo"/>            </button>
            <button
              className="button"
              disabled={history.length < 1}
              onClick={redo}
            >
              <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/redo.png" alt="redo"/>
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
              <span key={index}>
                {usr.name}
                {user && user.userId === usr.userId && " (You)"}
              </span>
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

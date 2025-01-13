import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import "./index.css";
import { toolHover } from "../../utils/hover";
import { ColorPicker } from "../../components/ColorPicker";
import Whiteboard from "../../components/Whiteboard";

//images
import brush from "../../assets/paintbrush.png";
import hachure from "../../assets/hachure.png";
import zigzagLine from "../../assets/zigzag-line.png";
import dots from "../../assets/dots.png";
import crossHatch from "../../assets/cross-hatch.png";
import dashed from "../../assets/dashed.png";
import sunburst from "../../assets/sunburst.png";
import solid from "../../assets/solid.png";

const RoomPage = ({ user, socket, users }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const { roomId } = useParams();
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [fillColor, setFillColor] = useState("black");
  const [fillStyle, setFillStyle] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [brushsize, setBrushSize] = useState(1);
  const [roughness, setRoughness] = useState(0);
  const [openChat, setOpenChat] = useState(true);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  // message Response useEffect
  useEffect(() => {
    const handleMessageResponse = (data) => {
      setChat((prevChat) => [...prevChat, data]);
    };
    socket.on("messageResponse", handleMessageResponse);
    return () => {
      socket.off("messageResponse", handleMessageResponse);
    };
  }, [socket]);

  // send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      socket.emit("message", { message, userId: user.userId, roomId });
      // setChat((prevChat) => [...prevChat, { message, user: "You" }]);
      setMessage("");
    }
  };

  // clearing canvas
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

  // download canvas image
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "whiteboard.png"; // File name for the downloaded image
    link.href = canvas.toDataURL("image/png"); // Canvas content as a data URL
    link.click(); // Programmatically triggers the download
  };

  // undo
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

  // Toggle user chat visibility
  const toggleUserchat = () => {
    setChatVisible(!chatVisible);
  };

  useEffect(() => {
    toolIconChange();
  }, [tool]);

  // tool cursor change
  const toolIconChange = () => {
    const canvs = document.getElementsByClassName("drawing-canvas")[0];
    if (tool == "pencil" || tool == "line") {
      canvs.style.cursor =
        "url(https://img.icons8.com/external-prettycons-solid-prettycons/30/external-pencil-tools-prettycons-solid-prettycons-2.png)0 50, auto";
    } else if (tool == "eraser") {
      canvs.style.cursor =
        "url(https://img.icons8.com/metro/25/eraser.png)0 50 , auto";
    } else if (tool == "highlighter") {
      canvs.style.cursor =
        "url(https://img.icons8.com/color/25/marker-pen.png)0 50 , auto";
    } else if (tool == "marker") {
      canvs.style.cursor =
        "url(https://img.icons8.com/ios-filled/25/marker-pen.png)0 50 , auto";
    } else if (
      tool == "rect" ||
      tool == "eclipse" ||
      tool == "circle" ||
      tool == "curve" ||
      tool == "polygon"
    ) {
      canvs.style.cursor = "crosshair";
    } else if (tool == "text") {
      canvs.style.cursor = "text";
    } else if (tool == "select") {
      canvs.style.cursor = "pointer";

      // canvs.style.cursor = "url(https://img.icons8.com/sf-regular/28/resize-four-directions.png)0 50 , auto";
    }
  };

  const myFunction = () => {
    document.getElementById("myDropdown").classList.add("show");
  };

  // fill pattern logo change
  useEffect(() => {
    const patterIcon = document.getElementById("dropdown-value-image");
    if (fillStyle == "zigzag-line") {
      patterIcon.src = zigzagLine;
    } else if (fillStyle == "cross-hatch") {
      patterIcon.src = crossHatch;
    } else if (fillStyle == null) {
      patterIcon.src = "https://img.icons8.com/windows/32/hand-holding.png";
    } else if (fillStyle == "dots") {
      patterIcon.src = dots;
    } else if (fillStyle == "dashed") {
      patterIcon.src = dashed;
    } else if (fillStyle == "sunburst") {
      patterIcon.src = sunburst;
    } else if (fillStyle == "solid") {
      patterIcon.src = solid;
    } else if (fillStyle == "hachure") {
      patterIcon.src = hachure;
    }
    // console.log(patterIcon.src);
  }, [fillStyle]);

  return (
    <div className="app-container">
      <div className="hoverName">
        <p className="Hnamep"></p>
      </div>
      {/* logo */}
      <header className="app-header">
        <div className="loggo">
          <span className="syncc">Sync</span>
          <span className="sketche">Sketch</span>
        </div>
      </header>

      {/* below header */}
      <div className="below-header">
        {/* tool station */}
        <div
          className="controls controls-bar"
          onMouseOver={(e) => toolHover(e)}
        >
          <img className="controls-bgi" src={brush}></img>
          {/* chat button */}
          <div className="control-item user-button" onClick={toggleUserchat}>
            <img
              className="menu-icon"
              src="https://img.icons8.com/?size=100&id=36389&format=png&color=ffffff"
              alt="User Menu Icon"
            />
            <h2>{users.length} Users Online</h2>
          </div>

          <div className="control-buttons">
            {/* stroke color picker */}
            <div className=" paintHolder hover-tool" id="Stroke-color">
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/dusk/30/paint-brush.png"
                alt="paint-brush"
                id="paint-plate"
              />

              <ColorPicker setColor={setColor} color={color}></ColorPicker>
            </div>
            {/*fill color picker */}
            <div className="fill-div paintHolder hover-tool" id="Fill-color">
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/color/30/fill-color.png"
                alt="fill-color"
              />
              <ColorPicker
                setColor={setFillColor}
                color={fillColor}
              ></ColorPicker>
            </div>

            {/* eraser */}
            <div
              className="tool-btn hover-tool"
              id="Eraser"
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

            {/* text */}
            <div className="tool-btn hover-tool" id="text">
              <img
                width="30"
                height="30"
                onClick={() => setTool("text")}
                src="https://img.icons8.com/ios-glyphs/30/paste-as-text.png"
                alt="text"
              />
            </div>

            {/* Select */}
            <div
              className="tool-btn hover-tool"
              id="Select"
              onClick={() => {
                setTool("select");
              }}
            >
              <img
                width="28"
                id="Select"
                height="28"
                src="https://img.icons8.com/sf-regular/48/resize-four-directions.png"
                alt="Select"
              />
            </div>

            {/* fill pattern dropdown */}
            <div className="dropdown ">
              {/* button to access pattern picker dropdown */}
              <button
                onClick={() =>
                  document.getElementById("myDropdown").classList.add("show")
                }
                className="dropbtn tool-btn hover-tool"
                id="Fill-Pattern"
              >
                <img
                  id="dropdown-value-image"
                  width="40"
                  height="40"
                  src="https://img.icons8.com/windows/40/hand-holding.png"
                  alt="empty_1"
                />
              </button>
              {/*all fill patterns / dropdown */}
              <div id="myDropdown" className="dropdown-content">
                <div
                  className="drop-pattern hover-tool"
                  id="Hachure"
                  onClick={() => setFillStyle("hachure")}
                >
                  <img src={hachure}></img>
                </div>
                <div
                  className="drop-pattern hover-tool"
                  id="zigzag-line"
                  onClick={() => setFillStyle("zigzag-line")}
                >
                  <img src={zigzagLine}></img>
                </div>
                <div
                  className="drop-pattern  hover-tool"
                  id="dots"
                  onClick={() => setFillStyle("dots")}
                >
                  <img src={dots}></img>
                </div>
                <div
                  className="drop-pattern  hover-tool"
                  id="cross-hatch"
                  onClick={() => setFillStyle("cross-hatch")}
                >
                  <img src={crossHatch}></img>
                </div>
                <div
                  className="drop-pattern  hover-tool"
                  id="dashed "
                  onClick={() => setFillStyle("dashed")}
                >
                  <img src={dashed}></img>
                </div>
                <div
                  className="drop-pattern  hover-tool"
                  id=" sunburst"
                  onClick={() => setFillStyle("sunburst")}
                >
                  <img src={sunburst}></img>
                </div>
                <div
                  className="drop-pattern  hover-tool"
                  id="solid "
                  onClick={() => setFillStyle("solid")}
                ></div>
                <div
                  className="drop-pattern  hover-tool"
                  id="Remove"
                  onClick={() => setFillStyle(null)}
                >
                  <img
                    width="28"
                    height="28"
                    src="https://img.icons8.com/windows/32/hand-holding.png"
                    alt="empty_1"
                  ></img>
                </div>
              </div>
            </div>

            {/* marker */}
            <div
              className="tool-btn hover-tool"
              id="Marker"
              onClick={() => {
                setTool("marker");
              }}
            >
              <img
                width="26"
                id="Marker"
                height="26"
                src="https://img.icons8.com/ios-filled/50/marker-pen.png"
                alt="marker"
              />
            </div>

            {/* high lighter */}
            <div
              className="tool-btn hover-tool"
              id="High Lighter"
              onClick={() => {
                setTool("highlighter");
              }}
            >
              <img
                width="30"
                id="High Lighter"
                height="30"
                src="https://img.icons8.com/color/48/marker-pen.png"
                alt="eraser"
              />
            </div>

            {/* tools */}

            {/* pencil */}
            <div
              className="tool-btn hover-tool"
              id="Pencil"
              onClick={() => setTool("pencil")}
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/external-itim2101-fill-itim2101/64/1A1A1A/external-pen-school-stationery-itim2101-fill-itim2101.png"
                alt="external-pen-school-stationery-itim2101-fill-itim2101"
              />
            </div>

            {/* Line */}
            <div
              className="tool-btn hover-tool"
              id="Line"
              onClick={() => setTool("line")}
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/ios/50/ruler.png"
                alt="ruler"
              />
            </div>

            {/* Rectangle */}
            <div
              className="tool-btn hover-tool"
              id="Rectangle"
              onClick={() => setTool("rect")}
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/material-outlined/24/rectangle-stroked.png"
                alt="rectangle-stroked"
              />
            </div>

            {/* circle */}
            <div className="tool-btn hover-tool" id="Circle">
              <img
                width="30"
                height="30"
                onClick={() => setTool("circle")}
                src="https://img.icons8.com/sf-regular/30/circled.png"
                alt="circled"
              />
            </div>

            {/* eclipse */}
            <div className="tool-btn hover-tool" id="Eclipse">
              <img
                width="40"
                height="20"
                onClick={() => setTool("eclipse")}
                src="https://img.icons8.com/sf-regular/30/circled.png"
                alt="eclipse"
              />
            </div>

            {/* curve
            <div className="tool-btn hover-tool" id="Curve">
              <img
                width="30"
                height="30"
                onClick={() => setTool("curve")}
                src="https://img.icons8.com/external-flat-icons-inmotus-design/67/external-Curve-geometry-forms-flat-icons-inmotus-design.png"
                alt="curve"
              />
            </div> */}

            {/* arc */}
            <div className="tool-btn hover-tool" id="Polygon">
              <img
                width="30"
                height="30"
                onClick={() => setTool("polygon")}
                src="https://img.icons8.com/external-flat-icons-inmotus-design/67/external-Curve-geometry-forms-flat-icons-inmotus-design.png"
                alt="polygon"
              />
            </div>
          </div>

          {/* brush size slider */}
          <div className="control-item brush-div hover-tool" id="Brush-Size">
            <input
              type="range"
              min="1"
              max="100"
              defaultValue="1"
              className="slider"
              id="myRange"
              onChange={(e) => setBrushSize(e.target.value)}
            ></input>
          </div>

          {/* Roughness slider */}
          <div className="control-item brush-div hover-tool" id="Roughness">
            <input
              type="range"
              min="0"
              max="2"
              defaultValue="0"
              className="slider"
              id="myRange"
              onChange={(e) => setRoughness(e.target.value)}
            ></input>
          </div>

          {/* undo */}
          <div className="control-item">
            <button
              className="button hover-tool"
              id="Undo"
              disabled={elements.length === 0}
              onClick={undo}
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/ios-filled/30/undo.png"
                alt="undo"
              />{" "}
            </button>

            {/* clear all */}
            <button
              className="button clear hover-tool"
              id="Clear All"
              disabled={elements.length < 1}
              onClick={handleClearCanvas}
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/ios/50/delete--v1.png"
                alt="delete--v1"
              />{" "}
            </button>
            {/* save button */}
            <button
              className="button hover-tool"
              id="save"
              disabled={elements.length < 1}
              onClick={downloadCanvas}
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/ios-filled/50/save.png"
                alt="redo"
              />
            </button>

            {/* redo */}
            <button
              className="button hover-tool"
              id="Redo"
              disabled={history.length < 1}
              onClick={redo}
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/ios-filled/50/redo.png"
                alt="redo"
              />
            </button>
          </div>
        </div>

        {/* user chat */}
        <div
          className={`user-chat ${
            chatVisible ? "chat-visible" : "chat-hidden"
          }`}
        >
          {/* chat btn */}
          <div
            className="open-chat-cont"
            onClick={() => setOpenChat(!openChat)}
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/plumpy/24/chat.png"
              alt="chat"
            />
            <button className="open-chat">
              {openChat ? "Open Chat" : "Users"}
            </button>
          </div>

          {/* chat names */}
          <div className={` ${openChat ? "name-visible" : "name-hidden"}`}>
            {users
              .filter((usr) => usr.roomId === roomId)
              .map((usr, index) => (
                <span key={index}>
                  {usr.name}
                  {user && user.userId === usr.userId && " (You)"}
                </span>
              ))}
          </div>

          {/* chat tools */}
          <div
            className={`chat-tools ${
              openChat ? "name-hidden" : "name-visible"
            }`}
          >
            <div className="chat">
              {chat.map((msg, index) => (
                <div
                  className={`chat-and-user ${
                    user && user.userId === msg.userId && "msg-me"
                  }`}
                  key={index}
                  id={users.find((usr) => usr.userId === msg.userId).name}
                >
                  <div className="chat-user-icon">
                    {users
                      .find((usr) => usr.userId === msg.userId)
                      .name.charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="chat-bubble">{msg.message}</div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
        {/* whiteboard */}
        <div className="canvas-container">
          <Whiteboard
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            elements={elements}
            setElements={setElements}
            tool={tool}
            color={color}
            socket={socket}
            fillColor={fillColor}
            fillStyle={fillStyle}
            brushsize={brushsize}
            roughness={roughness}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;

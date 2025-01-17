import { useEffect } from "react";
import PropTypes from "prop-types";

import "./index.css";
import JoinRoomForm from "./JoinRoomForm";
import CreateRoomForm from "./CreateRoomForm";
import brush from "../../assets/paintbrush.png";

const Forms = ({ uuid, socket, setUser }) => {
  const logoAnimation = () => {
    const logo = document.getElementsByClassName("logo")[0];
    const sync = document.getElementsByClassName("sync")[0];
    const sketch = document.getElementsByClassName("sketch")[0];
    const pencil = document.getElementById("logo-pencil");
    const row = document.getElementsByClassName("row")[0];
    const cont = document.getElementsByClassName("theContainer")[0];
    const formBox = document.getElementsByClassName("form-box");

    setTimeout(() => {
      sync.style.left = "45%";
      sketch.style.right = "42%";
    }, 500);

    setTimeout(() => {
      cont.style.background =
        "linear-gradient(to bottom, #e88eac00, rgba(255, 255, 255, 0), #5069d8c9)";
      pencil.style.opacity = "1";
      sync.style.left = "43%";
      sketch.style.right = "40%";
    }, 1000);

    setTimeout(() => {
      logo.style.top = "15%";
      logo.style.transform = "scale(1)";
    }, 1800);

    setTimeout(() => {
      row.style.backgroundImage = `url("${brush}")`;
    }, 2500);

    setTimeout(() => {
      Array.from(formBox).forEach((box) => {
        box.style.opacity = "1";
      });
    }, 4000);
  };

  useEffect(() => {
    logoAnimation();
  }, []);

  return (
    <div className="row">
      <div className="logo">
        <span className="sync">Sync</span>
        <img
          width={50}
          height={50}
          id="logo-pencil"
          src="https://img.icons8.com/?size=100&id=13370&format=png&color=000000"
        ></img>
        <span className="sketch">Sketch</span>
      </div>
      <div className="form-container">
        <div className="form-box">
          <h2 className="form-title">Create Room</h2>
          <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
        </div>

        <div className="form-box">
          <h2 className="form-title">Join Room</h2>
          <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
        </div>
      </div>
    </div>
  );
};
Forms.propTypes = {
  uuid: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Forms;

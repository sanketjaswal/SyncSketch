import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import PropTypes from "prop-types";
import { generateSixDigitCode } from "../../../utils/uuid";

const CreateRoomForm = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState(generateSixDigitCode());
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const createRoom = (e) => {
    e.preventDefault();

    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: true,
    };

    setUser(roomData);
    socket.emit("userJoined", roomData);
    navigate(`/${roomId}`);
  };

  return (
    <form>
      <div className="input-group">
        <input
          type="text"
          placeholder="Name"
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          className="input-field read-only"
          value={roomId}
          readOnly
        />
        <button
          type="button"
          className="btn generate-btn"
          onClick={() => setRoomId(generateSixDigitCode())}
        >
          Generate
        </button>
        <button
          type="button"
          className="btn copy-btn"
          onClick={() => navigator.clipboard.writeText(roomId)}
          disabled={!roomId} // Disable the button if roomId is empty
        >
          Copy
        </button>
      </div>
      <button type="submit" onClick={createRoom} className="btn submit-btn">
        Create Room
      </button>
    </form>
  );
};
CreateRoomForm.propTypes = {
  uuid: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default CreateRoomForm;

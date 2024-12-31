import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const CreateRoomForm = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState(uuid());
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
        <input type="text" className="input-field read-only" value={roomId} readOnly />
        <button
          type="button"
          className="btn generate-btn"
          onClick={() => setRoomId(uuid())}
        >
          Generate
        </button>
      </div>
      <button type="submit" onClick={createRoom} className="btn submit-btn">
        Create Room
      </button>
    </form>
  );
};

export default CreateRoomForm;

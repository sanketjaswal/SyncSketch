import { useState } from 'react';
import './index.css'
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const JoinRoomForm = ({uuid, socket, setUser}) => {

  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();

    const roomData = {
      name,
      roomId,
      userId: uuid(), 
      host: false,
      presenter : false
    }

    setUser(roomData);
    socket.emit("userJoined", roomData)
    navigate(`/${roomId}`)

  }

    return (
        <form >
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
              placeholder="Room Id"
              className="input-field"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
          <button type="submit" onClick={joinRoom} className="btn submit-btn">
            Join Room
          </button>
        </form>
    )
}
JoinRoomForm.propTypes = {
  uuid: PropTypes.func.isRequired,
  socket: PropTypes.shape({
    emit: PropTypes.func.isRequired
  }).isRequired,
  setUser: PropTypes.func.isRequired
};

export default JoinRoomForm;
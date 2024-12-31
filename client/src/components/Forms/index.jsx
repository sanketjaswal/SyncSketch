import CreateRoomForm from "./CreateRoomForm";
import "./index.css"
import JoinRoomForm from "./JoinRoomForm";

const Forms = ({uuid, socket, setUser}) => {
return (
    <div className="row">
    <div className="logo">
  <span className="sync">Sync</span><span className="sketch">Sketch</span>
</div>
    <div className="form-container">
      <div className="form-box">
        <h2 className="form-title">Create Room</h2>
        <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />

      </div>
  
      <div className="form-box">
        <h2 className="form-title">Join Room</h2>
        <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser}  />

      </div>
    </div>
  </div>
)

}

export default Forms;
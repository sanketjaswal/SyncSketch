import "./App.css";
import Forms from "./components/Forms";
import { Route, Routes } from "react-router-dom";
import RoomPage from "./pages/Room";

import io from "socket.io-client"
import { useEffect, useState } from "react";

// const server = "https://syncsketch-backend.onrender.com"
const server = "http://localhost:5000";


const connectionOption = {
  "force new connection": true,
  reconnectionAttempts: "infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOption)

const App = () => {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)

  useEffect(()=>{
    socket.on("userIsJoined", (data)=>{
      if(data.success){
        console.log("User is Joined")
        setUsers(data.users);
        // setUsers(data)
      }else{
        console.log("something went wrong")
      }
    })

    socket.on("allUsers", (data)=>{
      setUsers(data)
    })

    return () => {
      socket.off("userIsJoined");  
      socket.off("allUsers");
    };
  },[])


  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  return (
    <div className="theContainer">
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route path="/:roomId?" element={<RoomPage user={user} socket={socket} users={users} />} />
      </Routes>
    </div>
  );
};

export default App;

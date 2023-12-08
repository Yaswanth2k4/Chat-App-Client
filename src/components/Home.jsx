import React,{useState} from "react";
import Header from "./Header";
import "./Home.css"
import { doLogout, getCurrentUser } from "../auth";
import Chat from "./Chat";
import { socket } from "../socket";

function Home()
{
    const [roomId,setRoomId]=useState("");
    const [message,setMessage]=useState("")
    const [joinedRoom,setJoined]=useState(false);

    function handleCreateRoom()
    {
        var id=Math.floor(Math.random()*(9999999999-1000000000)+1000000000).toString(36)
        setRoomId({
            val:id
        });
        setJoined(true);
        socket.connect();
    }

    function handleChange(e)
    {
        const {value}=e.target;
        setRoomId(prev=>{
            return {...prev,val:value}
        })
    }

    function handleJoinRoom()
    {
        setMessage(roomId.val);
        setJoined(true);
        socket.connect();
    }

    return !joinedRoom?(
        <div>
            <Header></Header>
            <div id="home-div" className="container rounded rounded-5 border text-center bg-white">
                <h4 className="h3 my-4">Hello {getCurrentUser().name}! </h4>
                <button className="btn btn-primary" onClick={handleCreateRoom}>Create a new Room</button>
                <form className="mx-5 d-flex flex-column align-items-center" onSubmit={e=>e.preventDefault()}>
                    <label className="my-4 h4">Join a Room</label>
                    <input id="room-input" type="text" name="roomId" onFocus={()=>setMessage("")} onChange={handleChange} className="form-control mb-4" placeholder="Enter Room ID"></input>
                    <input type="submit" onClick={handleJoinRoom} className="btn btn-success mb-4" value="Join Room"/>
                </form>
                <button type="submit" className="btn btn-danger mb-4" onClick={()=>{doLogout()}}>Logout</button>
                <p className="p text-danger">{message}</p>
            </div>
        </div>
    ):<Chat 
        roomId={roomId.val}
        uid={getCurrentUser().id}
        name={getCurrentUser().name}
        />
}

export default Home;
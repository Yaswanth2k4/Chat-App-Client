import React ,{useEffect, useState} from "react";
import "./Chat.css";
import Header from "./Header";
import { IoSend } from "react-icons/io5";
import {IconButton} from "rsuite"
import axios from "axios";
import {socket} from "../socket"

function Chat(props)
{
    const [input,setInput]=useState("");
    const [chats,setChats]=useState([]);

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API}/chats/getchats/${props.uid}`)
        .then(res=>res.data)
        .then(data=>setChats(data));
    },[])

    function displayMessage(message)
    {
        setChats(prevChats=>[...prevChats,message])
    }

    socket.on("connect",()=>{
        console.log(`Connected with socket id ${socket.id}`)
        socket.emit("join-room",props.roomId,(message)=>{
            displayMessage(message);
            console.log(message);
        })
        socket.on("server-message",(message)=>{
            displayMessage(message);
            console.log(message)
        });
    })

    function sendMessage()
    {
        const text=input.text;
        setInput({text:""});
        setChats(prevChats=>[...prevChats,text])

        socket.emit("client-message",text,props.roomId);

        axios.post(`${process.env.REACT_APP_API}/chats/addchat/${props.uid}`,{chat:text})
        .then(res=>res.data)
    }

    function handleChange(e)
    {
        const {name,value}=e.target
        setInput(prev=>{
            return {
                ...prev,
                [name]:value
            }
        })
    }

    return(
        <div>
            <Header />
            <div id="chat-div" className="container border bg-white justify-between d-flex flex-row">

                <div name="left" className="container border border-top-0 my-2 p-0">
                    <div className="container text-center pt-2 pb-1 bg-primary w-100">
                        <p className="h5 text-white">Users</p>
                    </div>
                    <div className="container text-center border-bottom pt-2 pb-0 w-100">
                        <p className="fs-6 text-success">(You) {props.name}</p>
                    </div>
                </div>

                <div name="right" className="container position-relative border my-2 bg-light border-start-0 border-top-0 p-0">
                    <div className="container text-center pt-2 pb-1 bg-primary w-100">
                        <p className="h5 text-white">Room Id :{props.roomId}</p>
                    </div>
                    <div className="container d-flex flex-column border-0 w-100" style={{height:"82%",overflowY:"scroll"}}>
                        {
                            chats.map((chat)=>{
                                return <p>{chat}</p>
                            })
                        }
                    </div>
                    <form onSubmit={e=>e.preventDefault()} className="container border-0 d-flex flex-row w-100 p-1 rounded position-absolute bottom-0">
                            <input id="input" type="text" name="text" value={input.text} onChange={handleChange} className="form-control border-1 rounded-pill me-1" placeholder="Type a message"></input>
                            <IconButton id="button" icon={<IoSend />} type="submit" onClick={sendMessage} className="ps-3 pb-2 rounded-circle btn bg-primary text-white"> </IconButton>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Chat;
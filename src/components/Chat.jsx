import React ,{useEffect, useState} from "react";
import "./Chat.css";
import Header from "./Header";
import { IoSend } from "react-icons/io5";
import { SlLogout } from "react-icons/sl";
import { MdContentCopy } from "react-icons/md";
import {IconButton} from "rsuite"
import axios from "axios";
import {socket} from "../socket"
import Spinner from "./Spinner";

function Chat(props)
{
    const [input,setInput]=useState("");
    const [chats,setChats]=useState([]);
    const [users,setUsers]=useState([]);

    useEffect(()=>{
        // axios.get(`${process.env.REACT_APP_API}/chats/getchats/${props.uid}`)
        // .then(res=>res.data)
        // .then(data=>setChats(data));

        socket.on("connect",()=>{
            console.log(`Connected with socket id ${socket.id}`)
            socket.emit("join-room",props.roomId,props.name,props.uid,(message)=>{
                displayMessage(message,"",true);
                console.log(message);
            });
            socket.on("server-message",(message,name)=>{
                displayMessage(message,name,false);
                console.log(message)
            });
            socket.on("server-joined",(users,name)=>{
                displayMessage(`${name} joined the room`,"",true);
                users=users.filter(user=>user.uid!==props.uid)
                setUsers(users);
            })
            socket.on("users",(users)=>{
                users=users.filter(user=>user.uid!==props.uid);
                setUsers(users);
            })
            socket.on("server-left",(message)=>{
                displayMessage(message,"",true);
            })
        })

        return ()=>{
            // socket.disconnect();
            // socket.on("disconnect",()=>{
            //     socket.emit("leave-room",props.roomId,props.name);
            // })
            socket.off("connect");
        }
    },[])

    function displayMessage(message,name,isJoined)
    {
        const date=new Date();
        const time=date.getHours().toString().concat(":",String(date.getMinutes()).padStart(2,"0"))
        setChats(prevChats=>[...prevChats,{message:message,name:name,client:false,time:time,isJoined:isJoined}])
    }

    function sendMessage()
    {
        const text=input.text;
        if(text!=="")
        {
            setInput({text:""});

            const date=new Date();
            const time=date.getHours().toString().concat(":",String(date.getMinutes()).padStart(2,"0"))
            setChats(prevChats=>[...prevChats,{message:text,client:true,time:time,isJoined:false}])

            socket.emit("client-message",text,props.name,props.roomId);

            axios.post(`${process.env.REACT_APP_API}/chats/addchat/${props.uid}`,{message:text,client:true})
            .then(res=>res.data)
        }
    }

    function leaveRoom()
    {
        socket.emit("leave-room",props.uid,props.name)
        socket.disconnect();
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

    function copy()
    {
        navigator.clipboard.writeText(props.roomId)
    }

    return(
        <div>
            <Header />
            {/* <Spinner /> */}
            <div id="chat-div" className="container border bg-white justify-between d-flex flex-row">

                <div name="left" className="container d-flex flex-column justify-content-between border border-top-0 my-2 p-0">
                    <div className="container text-center pt-2 pb-1 bg-primary w-100">
                        <p className="h5 text-white">Users</p>
                    </div>
                    <div style={{overflowY:"scroll"}} className="w-100 h-100">
                        <div className="container text-center border-bottom pt-2 pb-0 w-100">
                            <p className="fs-6 text-success">(You) {props.name}</p>
                        </div>
                        {
                            users.map(user=>{
                                return  <div className="container text-center border-bottom pt-2 pb-0 w-100">
                                            <p className="fs-6 text-success">{user.name}</p>
                                        </div>
                            })
                        }
                    </div>
                </div>

                <div name="right" className="container position-relative d-flex flex-column justify-content-between border my-2 border-start-0 border-top-0 p-0" style={{backgroundColor:"#f2f2f2"}}>
                    
                    <div className="container d-flex flex-row justify-content-around text-center pt-2 pb-1 bg-primary w-100">
                            <IconButton icon={<MdContentCopy />} onClick={copy}  className="h6 pt-0 pb-1 ps-1 ps-0 bg-primary border border-white rounded-2 text-white"> </IconButton>
                            <h5 className="h5 text-white">Room Id : {props.roomId}</h5>
                            <IconButton icon={<SlLogout />} onClick={leaveRoom} className="h6 pt-0 pb-1 ps-1 ps-0 bg-primary border border-white rounded-2 text-white"> </IconButton>
                    </div>

                    <div className="container d-flex flex-column h-100 w-100 pt-2" style={{overflowY:"scroll",backgroundColor:"#f2f2f2"}}>
                        {
                            chats.map((chat)=>{
                                if(chat.client) return(
                                    <div className="d-flex flex-column container p-0 align-items-end justify-content-between w-100">
                                        <div className="sent p-1 px-2 pb-0 bg-primary w-auto" style={{maxWidth:"45%"}}>
                                            <p className="h6 p-0 fw-normal text-white">{chat.message}</p>
                                        </div>
                                        <p style={{fontSize:"12px"}}>{chat.time}</p>
                                    </div>
                                )
                                else if(chat.isJoined) return(
                                        <div className="rounded container bg-success p-1 px-2 pb-0 mb-2 w-auto">
                                            <p className="h6 fw-normal text-white">{chat.message}</p>
                                        </div>
                                )
                                else return (
                                    <div className="d-flex flex-column container p-0 align-items-start justify-content-between w-100">
                                        <div className="receive d-flex flex-column justify-content-center p-1 px-2 pb-0 border bg-white w-auto" style={{maxWidth:"45%"}}>
                                            <p className="fw-semibold p-0 m-0 text-primary" style={{fontSize:"13px"}}>{chat.name}</p>
                                            <h6 className="h6 fw-normal text-black">{chat.message}</h6>
                                        </div>
                                        <p style={{fontSize:"12px"}}>{chat.time}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <form onSubmit={e=>e.preventDefault()} className="container border-0 d-flex flex-row w-100 p-1 rounded">
                            <input id="input" type="text" name="text" value={input.text} onChange={handleChange} className="form-control border-1 rounded-pill me-1" placeholder="Type a message"></input>
                            <IconButton id="button" icon={<IoSend />} type="submit" onClick={sendMessage} className="ps-3 pb-2 rounded-circle btn bg-primary text-white"> </IconButton>
                    </form>
                </div>
            </div>
            
        </div>
    )
}

export default Chat;
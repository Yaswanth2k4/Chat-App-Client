import React,{useState} from "react"
import "./Login.css"
import axios from "axios";
import Header from "./Header";
import {doLogin,isLoggedIn} from "../auth/index.js";
import Home from "./Home.jsx";

function Login()
{
    const [submitBtn,setSubmitBtn]=useState("Login")
    const [isLogin,setLoginActive]=useState(true)
    const [isSignup,setSignupActive]=useState(false);
    const [message,setMessage]=useState("")
    const [isSuccess,setSuccess]=useState(false)
    const [input,setInput]=useState({
        Name:"",
        Email:"",
        Password:""
    })

    function handleChange(e)
    {
        setMessage("")
        const {name,value}=e.target;
        setInput(prev=>{
            return {
                ...prev,
                [name]:value
            }

        })
    }

    function signupClick()
    {
        setSubmitBtn("Signup")
        setSignupActive(true);
        setLoginActive(false)
    }

    function loginClick()
    {
        setSubmitBtn("Login")
        setLoginActive(true)
        setSignupActive(false);
    }
    
    function handleSubmitClick(e)
    {
        if(e.target.name==="Login" && input.Email!=="" && input.Password!=="")
        {
            axios.post(`${process.env.REACT_APP_API}/login`,{email:input.Email,password:input.Password})
            .then(res=>res.data).then(data=>{
                setMessage(data.message)
                setSuccess(true)
                doLogin(data.id,data.name);
            })
            .catch(function(err){
                setMessage(err.response.data.message)
                setSuccess(false)
            })
        }
        else if(e.target.name==="Signup")
        {
            if(input.Email!=="" && input.Name!=="" && input.Password!=="")
            axios.post(`${process.env.REACT_APP_API}/register`,{name:input.Name,email:input.Email,password:input.Password})
            .then(res=>res.data).then(data=>{
                setMessage(data.message)
                setSuccess(true)
                loginClick()
            })
            .catch(function(err){
                setMessage(err.response.data.message)
                setSuccess(false)
            })
        }
    }
    return !isLoggedIn()?(
    <div>
        <Header></Header>
        <div id="main-div" className="container rounded rounded-5 d-flex flex-column text-center bg-white">
            <h4 className="h4 mt-4">{submitBtn}</h4>
            <div className="border-0 btn-group mx-5 mt-3 mb-4" role="group">
                <button type="button" className={isLogin?"btn btn-primary text-center active py-2":"btn btn-primary text-center py-2"} onClick={loginClick}>Login</button>
                <button type="button" className={isSignup?"btn btn-primary text-center active py-2":"btn btn-primary text-center py-2"} onClick={signupClick}>Signup</button>
            </div>
            <form className="mx-5" onSubmit={e=>e.preventDefault()}>
    {isSignup && <input type="text" name="Name" value={input.Name} onFocus={()=>setMessage("")} onChange={handleChange} className="form-control mb-4" placeholder="Name" required="true"></input>}
                <input type="email" name="Email" value={input.Email} onFocus={()=>setMessage("")} onChange={handleChange} className="form-control mb-4" placeholder="Email Address" required></input>
                <input type="password" name="Password" value={input.Password} onFocus={()=>setMessage("")} onChange={handleChange} className="form-control mb-4" placeholder="Password" required></input>
                <input type="submit" name={submitBtn} className="btn btn-primary w-50 mb-4 py-2" onClick={handleSubmitClick} value={submitBtn} />
            </form>
            {isLogin && <button className="btn border-0 w-50 align-self-center" onClick={signupClick}>New User? <span className="text-primary">Signup</span></button>}
            <p className={isSuccess?"text-success align-self-center":"text-danger align-self-center"}>{message}</p>
        </div>
    </div>):<Home/>
}

export default Login;
import React from  "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./components/Login";
import { Helmet } from "react-helmet";

function App()
{
    return <BrowserRouter>
            <Helmet>
                <title>Dhootha - The Messenger</title>
                <meta name="description" content="Explore private chat rooms on our secure messaging app. Connect with friends and make new connections in a safe and private environment. Join us now!" />
                <meta name="keywords" content="Dhootha Dhoota messenger chatiing doota private chat app secure online chat " />
                <meta name="author" content="Yaswanth Kurapati" />
                <meta property="og:title" content="Dhootha - The Messenger" />
                <meta property="og:description" content="Explore private chat rooms on our secure messaging app. Connect with friends and make new connections in a safe and private environment. Join us now!" />
                <meta property="og:image" content="public\images\DhoothaLogo.png" />
                <meta property="og:url" content="https://dhootha.onrender.com" />
                <meta property="og:type" content="website" />

            </Helmet>
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>

}

export default App;
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Create from "./components/Create";
import HomeAdmin from "./components/Admin/HomeAdmin";
import UpdateAdmin from "./components/Admin/UpdateAdmin";
import Navbar from "./components/Navbar";
import Login from "./components/Login/Login";
import Success from "./components/Success";
import Read from "./components/Read";
import axios from "axios";
import Politique from "./components/Politique";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const baseUrl = "http://localhost:8000";

    useEffect(() => {
        // Vérifiez si un token est présent dans le localStorage
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // !! converts token to boolean
    }, []);

    const [mailer, setMailer] = useState({
        pseudo: "",
        subject: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setMailer({ ...mailer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mailer.pseudo.trim() === "" || mailer.email.trim() === "" || mailer.subject.trim() === "" || mailer.message.trim() === "") {
            if (mailer.pseudo.trim() === "") {
                document.getElementById("pseudo").classList.add("error");
            } else {
                document.getElementById("pseudo").classList.remove("error");
            }
            if (mailer.email.trim() === "") {
                document.getElementById("email").classList.add("error");
            } else {
                document.getElementById("email").classList.remove("error");
            }
            if (mailer.subject.trim() === "") {
                document.getElementById("subject").classList.add("error");
            } else {
                document.getElementById("subject").classList.remove("error");
            }
            if (mailer.message.trim() === "") {
                document.getElementById("message").classList.add("error");
            } else {
                document.getElementById("message").classList.remove("error");
            }
            return;
        }

        try {
            await axios.post(`${baseUrl}/email/sendEmail`, mailer);
            setAlertMessage("Votre message a été envoyé avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email :", error);
        }
        window.location.reload();
    };

    const paragraphRef = useRef(null);

    return (
        <BrowserRouter>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} paragraphRef={paragraphRef} />
            <Routes>
                <Route path="/" element={<Home handleChange={handleChange} handleSubmit={handleSubmit} alertMessage={alertMessage} paragraphRef={paragraphRef} />} />
                <Route path="/product/:id" element={<Read handleChange={handleChange} handleSubmit={handleSubmit} alertMessage={alertMessage} paragraphRef={paragraphRef} />} />
                <Route path="/politique" element={<Politique />} />
                <Route path="/home/admin" element={isLoggedIn ? <HomeAdmin /> : <Navigate to="/" />} />
                <Route path="/success/:id" element={<Success />} />
                <Route path="/admin/create" element={isLoggedIn ? <Create /> : <Navigate to="/" />} />
                <Route path="/update/admin/:id" element={isLoggedIn ? <UpdateAdmin /> : <Navigate to="/" />} />
                <Route path="/admin/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

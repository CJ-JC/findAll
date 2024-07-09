import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, HashRouter } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Create from "./components/Create";
import HomeAdmin from "./components/Admin/HomeAdmin";
import UpdateAdmin from "./components/Admin/UpdateAdmin";
import Navbar from "./components/Navbar";
import Login from "./components/Login/Login";
import Success from "./components/Success";
import Read from "./components/Read";
import Politique from "./components/Politique";
import PuffLoader from "react-spinners/PuffLoader";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifiez si un token est présent dans le localStorage
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // !! converts token to boolean
        setIsLoading(false);
    }, []);

    const paragraphRef = useRef(null);

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <PuffLoader color={"#fff"} size={150} aria-label="Loading Spinner" data-testid="loader" />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} paragraphRef={paragraphRef} />
            <Routes>
                <Route path="/" element={<Home paragraphRef={paragraphRef} />} />
                <Route path="/product/:id" element={<Read paragraphRef={paragraphRef} />} />
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

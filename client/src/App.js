import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Create from "./components/Create";
import HomeAdmin from "./components/Admin/HomeAdmin";
import UpdateAdmin from "./components/Admin/UpdateAdmin";
import Navbar from "./components/Navbar";

function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home/admin" element={<HomeAdmin />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/update/admin/:id" element={<UpdateAdmin />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;

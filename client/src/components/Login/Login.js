import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const baseUrl = "https://findall.onrender.com";

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(`${baseUrl}/login`, values)
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                setIsLoggedIn(true);
                navigate("/home/admin");
            })
            .catch((error) => {
                setError("Email ou mot de passe incorrect.");
            });
    };

    return (
        <form className="container my-5" onSubmit={handleSubmit}>
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 col-xl-4 mb-5">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="card p-5">
                        <div className="form-group mb-4">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} id="email" />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Mot de passe</label>
                            <input type="password" name="password" className="form-control" placeholder="Mot de passe" onChange={handleChange} id="password" />
                        </div>
                        <button className="btn btn-light w-auto m-auto">Se connecter</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Login;

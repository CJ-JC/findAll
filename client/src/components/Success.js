import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleChange = () => {
        navigate("/");
    };

    return (
        <div className="container my-5">
            {email && (
                <div className="card p-5">
                    <h2>Merci pour votre commande !</h2>
                    <h4>Votre paiement est réussi</h4>
                    <p>Nous reviendrons vers vous au plus vite à votre adresse mail "{email}"</p>
                    <button className="btn btn-danger w-auto mx-auto mt-5" onClick={handleChange}>
                        Page d'accueil
                    </button>
                </div>
            )}
        </div>
    );
};

export default Success;

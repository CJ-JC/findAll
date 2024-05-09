import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Success = () => {
    const { id } = useParams();
    const navigate = useNavigate("");

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios
            .get(`http://localhost:8000/success/${id}`)
            .then((result) => setMessage(result.data.message))
            .catch((err) => setMessage(err));

        setTimeout(() => {
            navigate("/");
        }, 5000);
    }, [id]);

    const handleChange = () => {
        navigate("/");
    };
    return (
        <div className="container my-5">
            <div className="card p-5">
                <h2>Merci pour votre commande !</h2>
                <h4>Votre paiement est réussi</h4>
                {message && <p>{message}</p>}
                {email && <p>Nous reviendrons vers vous au plus vite à votre adresse mail {email}</p>}
                <button className="btn btn-danger w-auto mx-auto mt-5" onClick={handleChange}>
                    Page d'accueil
                </button>
            </div>
        </div>
    );
};

export default Success;

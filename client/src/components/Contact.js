import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
    const baseUrl = "https://digital-discount-server.vercel.app/";
    const [alertMessage, setAlertMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

        // Vérification des champs requis
        if (!mailer.pseudo || !mailer.subject || !mailer.email || !mailer.message) {
            setErrorMessage("Veuillez remplir tous les champs obligatoires.");
            setAlertMessage("");
            return;
        }

        await axios
            .post(`${baseUrl}/email/sendEmail`, mailer)
            .then((response) => {
                setAlertMessage("Votre message a été envoyé avec succès !");
                setErrorMessage("");
                setMailer({
                    pseudo: "",
                    subject: "",
                    email: "",
                    message: "",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {alertMessage && <div className="text-success">{alertMessage}</div>}
            {errorMessage && <div className="text-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-6">
                        <label htmlFor="pseudo">Votre pseudo*</label>
                        <input name="pseudo" id="pseudo" onChange={handleChange} value={mailer.pseudo} className={`feedback-input`} type="text" placeholder="Votre pseudo" />
                    </div>
                    <div className="col-lg-6">
                        <label htmlFor="subject">Sujet du message*</label>
                        <input name="subject" id="subject" onChange={handleChange} value={mailer.subject} className={`feedback-input`} type="text" placeholder="Le sujet" />
                    </div>
                    <div className="col-lg-12">
                        <label htmlFor="email">Votre email*</label>
                        <input name="email" id="email" onChange={handleChange} value={mailer.email} className={`feedback-input`} type="email" placeholder="Votre email" />
                    </div>
                    <div className="col-lg-12">
                        <label htmlFor="message">Message*</label>
                        <textarea name="message" id="message" onChange={handleChange} value={mailer.message} className={`feedback-input`} type="text" placeholder="Écrivez votre message ici..." />
                    </div>
                    <button className="btn btn-light">Envoyer</button>
                </div>
            </form>
        </>
    );
};

export default Contact;

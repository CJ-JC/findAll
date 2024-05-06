import React, { useEffect, useState } from "react";

import axios from "axios";
import Read from "./Read";
import Footer from "./Footer";
import Carousel from "./Carousel";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const baseUrl = "http://localhost:8000";

    useEffect(() => {
        axios
            .get(`${baseUrl}`)
            .then((result) => setProducts(result.data))
            .catch((err) => setProducts(err));
    }, []);

    // const [mailer, setMailer] = useState({
    //     pseudo: "",
    //     subject: "",
    //     email: "",
    //     message: "",
    // });

    // const handleChange = (e) => {
    //     setMailer({ ...mailer, [e.target.name]: e.target.value });
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (mailer.pseudo.trim() === "" || mailer.email.trim() === "" || mailer.subject.trim() === "" || mailer.message.trim() === "") {
    //         if (mailer.pseudo.trim() === "") {
    //             document.getElementById("pseudo").classList.add("error");
    //         } else {
    //             document.getElementById("pseudo").classList.remove("error");
    //         }
    //         if (mailer.email.trim() === "") {
    //             document.getElementById("email").classList.add("error");
    //         } else {
    //             document.getElementById("email").classList.remove("error");
    //         }
    //         if (mailer.subject.trim() === "") {
    //             document.getElementById("subject").classList.add("error");
    //         } else {
    //             document.getElementById("subject").classList.remove("error");
    //         }
    //         if (mailer.message.trim() === "") {
    //             document.getElementById("message").classList.add("error");
    //         } else {
    //             document.getElementById("message").classList.remove("error");
    //         }
    //         return;
    //     }

    //     try {
    //         const res = await axios.post(`${baseUrl}/email/sendEmail`, mailer, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });

    //         if (res.status > 200 && res.status < 300) {
    //             setAlertMessage("Votre message a été envoyé avec succès !");
    //         }

    //         setTimeout(() => {
    //             setAlertMessage("");
    //         }, 5000);
    //     } catch (error) {
    //         console.error("Erreur lors de l'envoi de l'email :", error);
    //     }
    // };

    return (
        <>
            <div className="home-page">
                {/* <h1 className="hs-item-title">S'abonner à la joie sans se serrer la ceinture !</h1> */}
                {/* <h1 className="hs-item-title">Écoutez, regardez, savourez... sans casser votre tirelire</h1> */}
                <h1 className="container hs-item-title">
                    Des heures de divertissement sans compter, <br /> à prix mini pour le plaisir maxi
                </h1>
                {/* <h1 className="container hs-item-title">Écoutez, regardez dites adieu aux pubs et aux tarifs exorbitants, c'est par ici !</h1> */}
                <Carousel />
                <div className="scrolldown">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className="container" style={{ marginTop: "6em" }}>
                <div className="message-info">
                    <div className="message-info__content">
                        <span style={{ color: "#fff", fontWeight: 400 }}>
                            Il se peut que notre site soit bloqué 🚫 en France !<br />
                            Utilisez un VPN ou changez vos DNS pour ne plus être bloqué par vos FAI »
                        </span>
                        <a href="https://changetondns.fr/" style={{ color: "#fff", fontWeight: 400 }} rel="noreferrer" target="_blank">
                            comment changer mes DNS ?
                        </a>
                    </div>
                </div>
                <div className="my-5">
                    <p>
                        Alors, qu'attendez-vous pour rejoindre la communauté des malins qui ont choisi de faire des économies tout en se faisant plaisir ? <br /> Inscrivez-vous dès maintenant et découvrez un nouveau monde de divertissement à prix mini !
                    </p>
                </div>
                <h2>Les offres qui font tourner les têtes sans les tordre !</h2>
                <div className="hs-item">
                    <p>De Spotify à YouTube Premium en passant par Netflix et bien d'autres encore, nous avons rassemblé pour vous les meilleurs abonnements à des tarifs imbattables.</p>
                    <p>Fini les compromis entre qualité et prix, avec nous, vous pouvez tout avoir, et à moindre coût !</p>
                </div>
                <div className="row my-2 justify-content-center">
                    {products.map((product) => (
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 my-3 list_product px-0" key={product.id}>
                            <div className="card">
                                <img className="card-img-top" src={`http://localhost:8000/upload/${product.image}`} alt={product.title} />
                                <div className="card-body">
                                    <h6 className="card-title">{product.title}</h6>
                                    <p className="card-text">Valable : 1 an</p>
                                    {product.options.length > 0 && (
                                        <div>
                                            <h6 className="card-text">{product.options[0].option_price}€</h6>
                                        </div>
                                    )}
                                    <Read product={product} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="container contact my-5">
                <h2>
                    Contactez notre équipe, <br /> on est plus réactif qu'un skip sur une pub !
                </h2>
                <div className="card p-4 mx-0 my-4">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-6 col-sm-12 my-2">
                            <div className="col-6">
                                <i className="fa fa-envelope" aria-hidden="true"></i>
                                <p></p>
                            </div>
                            <div className="col-6">
                                <i className="fa fa-whatsapp" aria-hidden="true"></i>
                                <p>+242 123 123 123</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 my-2">
                            <Contact handleChange={handleChange} handleSubmit={handleSubmit} alertMessage={alertMessage} />
                        </div>
                    </div>
                </div>
            </div> */}
            <Footer />
        </>
    );
};

export default Home;

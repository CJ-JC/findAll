import React, { useEffect, useState } from "react";

import axios from "axios";
import Footer from "./Footer";
import Carousel from "./Carousel";
import Contact from "./Contact";

const Home = ({ paragraphRef }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const baseUrl = `http://localhost:8000/api`;

    useEffect(() => {
        axios
            .get(`${baseUrl}/categories`)
            .then((result) => {
                setCategories(result.data);
            })
            .catch((err) => console.error("Error fetching categories:", err));

        axios
            .get(`${baseUrl}/products/all`)
            .then((result) => setProducts(result.data))
            .catch((err) => console.error("Error fetching products:", err));
    }, []);

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        axios
            .get(`${baseUrl}/products/${categoryId}`)
            .then((result) => setProducts(result.data))
            .catch((err) => console.error("Error fetching products by category:", err));
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="spinner">
                <div className="half-spinner"></div>
            </div>
        );
    }

    return (
        <>
            <div className="home-page">
                <h1 className="container hs-item-title">Des heures de divertissement sans compter, à prix mini avec Digital-discount</h1>
                <Carousel />
                <div className="scrolldown">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className="container" style={{ marginTop: "6em", marginBottom: "6em" }}>
                <div className="message-info">
                    <div className="message-info__content">
                        <span style={{ color: "#fff", fontWeight: 400 }}>
                            Il se peut que notre site soit bloqué 🚫 en France !<br />
                            Utilisez un VPN ou changez vos DNS pour ne plus être bloqué par vos FAI »{" "}
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
                <div className="buttons">
                    <button className={`button ${activeCategory === "all" ? "active" : ""}`} onClick={() => handleCategoryClick("all")}>
                        Tous les produits
                    </button>
                    {categories &&
                        categories.map((category) => (
                            <button key={category.id} className={`button ${activeCategory === category.id ? "active" : ""}`} onClick={() => handleCategoryClick(category.id)}>
                                {category.title}
                            </button>
                        ))}
                </div>
                <div className="justify-content-center row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div className="col" key={product.id}>
                                <div className="card" style={{ minHeight: "280px" }}>
                                    <a href={`/product/${product.id}`}>
                                        <img className="card-img-top" src={`http://localhost:8000/api/upload/${product.image}`} alt={product.title} />
                                        <div className="card-body">
                                            <h6 className="card-title">{product.title}</h6>
                                            {/* <p className="card-text">Valable : 1 an</p> */}
                                            {product.options.length > 0 && (
                                                <div>
                                                    <h6 className="card-text">{product.options[0].option_price}€</h6>
                                                </div>
                                            )}
                                            {product.real_price ? (
                                                <div style={{ fontSize: "14px" }}>
                                                    <p className="m-0">soit {product.price_per_month}€ / mois</p>
                                                    <strike>
                                                        {product.real_price}€ sur {product.title}
                                                    </strike>
                                                </div>
                                            ) : (
                                                <p className="m-0">soit {product.price_per_month}€ / mois</p>
                                            )}
                                        </div>
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">
                            <p>Aucun produit disponible.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="container contact my-5" ref={paragraphRef}>
                <h2>Contactez notre équipe</h2>
                <div className="card p-4 my-2">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-lg-6 col-md-6 col-sm-12 my-2 mx-0">
                            <Contact />
                        </div>
                    </div>
                </div>
            </div>
            <a href="https://t.me/discountdigital" target="_blank" className="telegram" title="Telegram">
                <i className="fa fa-paper-plane text-light"></i>
            </a>
            <Footer />
        </>
    );
};

export default Home;

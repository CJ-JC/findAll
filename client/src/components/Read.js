import React, { useEffect, useState } from "react";
import CheckoutForm from "./stripe/CheckoutForm";
import { useParams } from "react-router-dom";
import axios from "axios";
import Contact from "./Contact";
import Footer from "./Footer";
import Politique from "./Politique";

const Read = ({ handleChange, handleSubmit, alertMessage, paragraphRef }) => {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [defaultOption, setDefaultOption] = useState(null);
    const [product, setProduct] = useState(null);

    const { id } = useParams();

    const baseUrl = "http://localhost:8000";

    useEffect(() => {
        axios
            .get(`${baseUrl}/product/${id}`)
            .then((result) => {
                setProduct(result.data[0]);
                if (result.data[0].options.length > 0) {
                    setDefaultOption(result.data[0].options[0].id);
                    setSelectedOptions([result.data[0].options[0].id]);
                }
            })
            .catch((err) => setProduct(err));
    }, [id]);

    const updateQuantity = (amount) => {
        const newQuantity = Math.min(10, Math.max(1, quantity + amount));
        setQuantity(newQuantity);
    };

    const handleOptionChange = (optionId) => {
        let updatedOptions = [];

        if (selectedOptions.includes(optionId)) {
            updatedOptions = selectedOptions.filter((id) => id !== optionId);
        } else {
            updatedOptions = [optionId];
        }

        setSelectedOptions(updatedOptions);
    };

    if (!product) {
        return <div>Chargement...</div>;
    }

    const selectedOption = product.options?.find((option) => selectedOptions.includes(option.id));

    const totalPrice = parseFloat(((selectedOption ? selectedOption.option_price : product.price) * quantity).toFixed(2));

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card p-4">
                            <h2>{product.title}</h2>

                            <img src={`http://localhost:8000/upload/${product.image}`} alt={product.image} style={{ margin: "auto", width: "80%", objectFit: "cover", height: "100%" }} />
                            <p>{product.description}</p>
                            <br />
                            <h6>Garantie 1 mois. En cas de problème dans un délai d'un mois, vous recevrez un remplacement gratuit.</h6>
                        </div>
                        <div className="card my-4 p-4">
                            <Politique />
                            <a href="https://t.me/ecotunes" target="_blank" className="telegram" title="Telegram">
                                <i className="fa fa-paper-plane text-light"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <h6>Type de compte :</h6>
                        {product.options.map((option) => (
                            <label className={`product mx-0 mb-3 p-3 d-flex align-items-center ${selectedOptions.includes(option.id) ? "selected" : ""}`} key={option.id}>
                                <input type="radio" value={option.id} checked={selectedOptions.includes(option.id)} onChange={() => handleOptionChange(option.id)} disabled={product.options.length === 1} />
                                {option.option_name} - {option.option_price}€
                            </label>
                        ))}
                        <div className="card mx-0 mb-3 p-3">
                            <div className="content">
                                <h6>Délai de livraison</h6>
                                Dans les 2h
                            </div>
                            <div className="content">
                                <h6>Quantité</h6>
                                <div className="quantity">
                                    <button className="minus" onClick={() => updateQuantity(-1)}>
                                        -
                                    </button>
                                    <h6 className="mb-0 quantity-number">{quantity}</h6>
                                    <button className="plus" onClick={() => updateQuantity(1)}>
                                        +
                                    </button>
                                </div>
                            </div>
                            <CheckoutForm product={product} totalPrice={totalPrice} selectedOptions={selectedOptions} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="container contact my-5" ref={paragraphRef}>
                <h2>Contactez notre équipe</h2>
                <div className="card p-4 my-2">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-lg-6 col-md-6 col-sm-12 my-2 mx-0">
                            <Contact handleChange={handleChange} handleSubmit={handleSubmit} alertMessage={alertMessage} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Read;

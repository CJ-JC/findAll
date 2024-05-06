import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import CheckoutForm from "./stripe/CheckoutForm";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    // bgcolor: "rgb(24, 29, 45)",
    bgcolor: "rgb(17 20 29)",
    boxShadow: 24,
    color: "white",
    border: "1px solid #bfbfbf",
    p: 4,
};

const Read = ({ product }) => {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [defaultOption, setDefaultOption] = useState(null);

    useEffect(() => {
        if (product.options.length > 0) {
            setDefaultOption(product.options[0].id);
            setSelectedOptions([product.options[0].id]);
        }
    }, [product]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const updateQuantity = (amount) => {
        const newQuantity = Math.max(1, quantity + amount);
        setQuantity(newQuantity);
    };

    const handleOptionChange = (optionId) => {
        let updatedOptions = [];

        // Si l'option actuelle est déjà sélectionnée, désélectionnez-la
        if (selectedOptions.includes(optionId)) {
            updatedOptions = selectedOptions.filter((id) => id !== optionId);
        } else {
            // Sinon, sélectionnez uniquement l'option actuelle
            updatedOptions = [optionId];
        }

        setSelectedOptions(updatedOptions);
    };

    // Trouver l'option sélectionnée
    const selectedOption = product.options.find((option) => selectedOptions.includes(option.id));

    // Calculer le prix total en fonction de la quantité et de l'option sélectionnée
    const totalPrice = (selectedOption ? selectedOption.option_price : product.price) * quantity;

    return (
        <div className="text-center">
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <div className="row">
                        <h3 className="text-center">{product.title}</h3>
                        <hr />
                        <div className="col-xl-4 col-lg-4 col-md-3 d-flex align-items-center">
                            <img src={`http://localhost:8000/upload/${product.image}`} alt={product.image} style={{ width: "100%" }} />
                        </div>
                        <div className="col-xl-8 col-lg-8 col-md-9 my-2">
                            <h5>Abonnement pour : 12 mois</h5>
                            <div className="description-wrapper">
                                <p>{product.description}</p>
                            </div>
                            <br />
                            <h6>Type de compte :</h6>
                            {product.options.map((option) => (
                                <div key={option.id}>
                                    <label>
                                        <input type="radio" value={option.id} checked={selectedOptions.includes(option.id)} onChange={() => handleOptionChange(option.id)} disabled={product.options.length === 1} />
                                        {option.option_name} - {option.option_price}€
                                    </label>
                                </div>
                            ))}
                            <br />
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
                </Box>
            </Modal>
            <button className="mt-3 btn btn-light w-auto fw-light" onClick={handleOpen}>
                En savoir plus
            </button>
        </div>
    );
};

export default Read;

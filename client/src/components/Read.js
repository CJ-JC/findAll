import React, { useState } from "react";
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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const updateQuantity = (amount) => {
        const newQuantity = Math.max(1, quantity + amount);
        setQuantity(newQuantity);
    };

    const totalPrice = product.price * quantity;

    return (
        <div className="container text-center">
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
                        <CheckoutForm product={product} totalPrice={totalPrice} />
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

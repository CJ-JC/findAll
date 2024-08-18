import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import { Link } from "react-router-dom";

const Modalopen = ({ product }) => {
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const [open, setOpen] = useState(false);

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "70%",
        maxHeight: "800px",
        overflow: "auto",
        bgcolor: "#000",
        boxShadow: 24,
        color: "white",
        border: "1px solid #bfbfbf",
        p: 2,
    };
    return (
        <>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <h3 className="text-center">{product.title}</h3>
                    <hr />
                    {product.options.map((option) => (
                        <div key={option.id}>
                            <p>
                                {option.option_name} - {option.option_price}€
                            </p>
                        </div>
                    ))}
                    <p>{product.price_per_month}€ / mois</p>
                    <p>
                        {product.real_price}€ sur {product.title}
                    </p>
                    <br />
                    <h5>Abonnement pour : 12 mois</h5>
                    <div className="description-wrapper">
                        <p>{product.description}</p>
                    </div>
                </Box>
            </Modal>
            <Link className="btn btn-light d-inline-flex align-items-center" onClick={handleOpen}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.87 11.496c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1.001 1.001 0 0 0 0-1Zm-9.65 5.5c-4.31.1-7.12-3.59-8-5 1-1.61 3.61-4.9 7.61-5 4.29-.11 7.11 3.59 8 5-1.03 1.61-3.61 4.9-7.61 5Z"></path>
                    <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"></path>
                </svg>
            </Link>
        </>
    );
};

export default Modalopen;

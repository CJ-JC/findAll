import React, { useState } from "react";
import axios from "axios";
import { Box, Modal } from "@mui/material";

const Create = ({ handleClose, handleOpen, open, style }) => {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: "",
        image: null,
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", product.title);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("image", image);

        axios
            .post("http://localhost:8000/create", formData)
            .then((res) => {
                setProduct(res.data);
                window.location.reload();
            })
            .catch((err) => setProduct(err));
    };

    return (
        <>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <form className="container" onSubmit={handleSubmit}>
                        <h1 className=" text-center">Ajout de produits</h1>
                        <hr />
                        <div className="row justify-content-center">
                            <div className="col-6 my-3">
                                <label htmlFor="title">Titre</label>
                                <input id="title" className="form-control" required type="text" onChange={handleChange} name="title" placeholder="Titre du produit" />
                            </div>
                            <div className="col-6 my-3">
                                <label htmlFor="price">Prix</label>
                                <input id="price" className="form-control" required type="text" onChange={handleChange} name="price" placeholder="Prix du produit" />
                            </div>
                            <div className="col-6 my-3">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" className="form-control" required type="text" onChange={handleChange} name="description" placeholder="Description du produit" />
                                {/* <CKEditor editor={ClassicEditor} data={product.description} onChange={handleEditorChange} /> */}
                            </div>
                            <div className="col-6 my-3">
                                <label htmlFor="image">Image du produit</label>
                                <input id="image" className="form-control" required type="file" onChange={handleImageChange} name="image" placeholder="Image du produit" />
                            </div>
                            <button className="btn btn-success w-25">Créer</button>
                        </div>
                    </form>
                </Box>
            </Modal>
            <button className="btn btn-light" onClick={handleOpen}>
                Créer un produit
            </button>
        </>
    );
};

export default Create;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Modal } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import Select from "react-select";

const Create = ({ handleClose, handleOpen, open, style }) => {
    const [product, setProduct] = useState({
        title: "",
        real_price: "",
        price_per_month: "",
        description: "",
        image: null,
        category_id: "",
    });

    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate("");

    useEffect(() => {
        axios
            .get("https://findall.onrender.com/categories")
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const [options, setOptions] = useState([]);

    const handleAddOption = () => {
        setOptions([...options, { name: "", price: "" }]);
    };

    const handleOptionChange = (e, index) => {
        const { name, value } = e.target;
        const newOptions = [...options];
        newOptions[index][name] = value;

        setOptions(newOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", product.title);
        formData.append("real_price", product.real_price);
        formData.append("price_per_month", product.price_per_month);
        formData.append("description", product.description);
        formData.append("image", image);
        formData.append("category_id", product.category_id);

        // Ajouter les options
        options.forEach((option, index) => {
            formData.append(`option_name_${index}`, option[`option_name_${index}`]);
            formData.append(`option_price_${index}`, option[`option_price_${index}`]);
        });

        axios
            .post("https://findall.onrender.com/create", formData)
            .then((res) => {
                setProduct(res.data);
                navigate("/");
            })
            .catch((err) => setProduct(err));
    };

    return (
        <>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <form className="container" onSubmit={handleSubmit} style={{ maxHeight: "620px", overflow: "auto" }}>
                        <h1 className=" text-center">Ajout de produits</h1>
                        <hr />
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="title">Titre</label>
                                <input id="title" className="form-control" required type="text" onChange={handleChange} name="title" placeholder="Titre du produit" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="image">Image du produit</label>
                                <input id="image" className="form-control" required type="file" onChange={handleImageChange} name="image" placeholder="Image du produit" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="price_per_month">Prix par mois</label>
                                <input id="price_per_month" className="form-control" type="text" onChange={handleChange} name="price_per_month" placeholder="Titre du produit" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="real_price">Vrai prix</label>
                                <input id="real_price" className="form-control" type="text" onChange={handleChange} name="real_price" placeholder="Titre du produit" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="category">Catégorie du produit</label>
                                <select id="category" className="form-control" onChange={handleChange} name="category_id">
                                    <option>Sélectionnez une catégorie</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {options.map((option, index) => (
                                <div className="row px-0" key={index}>
                                    <div className="col-lg-6 col-md-12 my-3">
                                        <label htmlFor={`${option.option_name}`}>Nom de l'option</label>
                                        <input className="form-control" type="text" onChange={(e) => handleOptionChange(e, index)} name={`option_name_${index}`} placeholder="Nom de l'option" />
                                    </div>
                                    <div className="col-lg-6 col-md-12 my-3">
                                        <label htmlFor={`${option.option_price}`}>Prix de l'option</label>
                                        <input className="form-control" type="text" onChange={(e) => handleOptionChange(e, index)} name={`option_price_${index}`} placeholder="Prix de l'option" />
                                    </div>
                                </div>
                            ))}
                            <div className="col-lg-12 col-md-12 my-3">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" className="form-control" required type="text" onChange={handleChange} name="description" placeholder="Description du produit" />
                            </div>
                            <div className="col-12 my-3">
                                <button type="button" className="btn btn-secondary" onClick={handleAddOption}>
                                    Ajouter une option
                                </button>
                            </div>
                            <button className="btn btn-success w-auto">Créer le produit</button>
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

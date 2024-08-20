import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Create = ({ handleClose, handleOpen, open, style }) => {
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [realPrice, setRealPrice] = useState("");
    const [pricePerMonth, setPricePerMonth] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [options, setOptions] = useState([]);

    useEffect(() => {
        axios
            .get("https://digital-discount.co/api/categories")
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "title":
                setTitle(value);
                break;
            case "pricePerMonth":
                setPricePerMonth(value);
                break;
            case "realPrice":
                setRealPrice(value);
                break;
            case "categoryId":
                setCategoryId(value);
                break;
            default:
                break;
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleAddOption = () => {
        setOptions([...options, { name: "", price: "" }]);
    };

    const handleOptionChange = (e, index) => {
        const { name, value } = e.target;
        const newOptions = [...options];
        newOptions[index][name] = value;

        setOptions(newOptions);
    };

    const handleDeleteOption = (index) => {
        setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("real_price", realPrice);
        formData.append("price_per_month", pricePerMonth);
        formData.append("category_id", categoryId);
        if (image) {
            formData.append("image", image);
        }

        // Ajouter les options
        options.forEach((option, index) => {
            formData.append(`option_name_${index}`, option.name);
            formData.append(`option_price_${index}`, option.price);
        });

        axios
            .post("https://digital-discount.co/api/create", formData)
            .then((res) => {
                navigate("/");
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <form className="container" onSubmit={handleSubmit} style={{ maxHeight: "620px", overflow: "auto" }}>
                        <h1 className="text-center">Créer un produit</h1>
                        <hr />
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="title">Titre</label>
                                <input id="title" name="title" className="form-control" required type="text" onChange={handleChange} value={title} placeholder="Titre du produit" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="image">Image du produit</label>
                                <input id="image" name="image" className="form-control" required type="file" onChange={handleImageChange} />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="price_per_month">Prix par mois</label>
                                <input id="price_per_month" name="pricePerMonth" className="form-control" type="text" onChange={handleChange} value={pricePerMonth} placeholder="Prix par mois" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="real_price">Vrai prix</label>
                                <input id="real_price" name="realPrice" className="form-control" type="text" onChange={handleChange} value={realPrice} placeholder="Vrai prix" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="category">Catégorie du produit</label>
                                <select id="category" className="form-control" onChange={handleChange} name="categoryId" value={categoryId}>
                                    <option value="">Sélectionnez une catégorie</option>
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
                                        <label htmlFor={`option_name_${index}`}>Nom de l'option</label>
                                        <input className="form-control" type="text" onChange={(e) => handleOptionChange(e, index)} name={`name`} placeholder="Nom de l'option" value={option.name} />
                                    </div>
                                    <div className="col-lg-5 col-md-5 my-3">
                                        <label htmlFor={`option_price_${index}`}>Prix de l'option</label>
                                        <input className="form-control" type="text" onChange={(e) => handleOptionChange(e, index)} name={`price`} placeholder="Prix de l'option" value={option.price} />
                                    </div>
                                    <div className="col-lg-1 col-md-1 m-auto">
                                        <i className="fa fa-trash" aria-hidden="true" onClick={() => handleDeleteOption(index)}></i>
                                    </div>
                                </div>
                            ))}
                            <div className="col-lg-12 col-md-12 my-3">
                                <label htmlFor="description">Description</label>
                                <ReactQuill theme="snow" className="bg-light" id="description" value={description} onChange={setDescription} />
                            </div>
                            <div className="col-12 my-3">
                                <button type="button" className="btn btn-secondary" onClick={handleAddOption}>
                                    Ajouter une option
                                </button>
                            </div>
                            <div className="text-center">
                                <button className="btn btn-success w-auto mx-2" type="submit">
                                    Créer le produit
                                </button>
                                <a href="/home/admin" className="btn btn-danger w-auto">
                                    Annuler
                                </a>
                            </div>
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

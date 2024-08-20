import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UpdateAdmin = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [error, setError] = useState("");

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

    useEffect(() => {
        axios
            .get(`https://digital-discount.co/api/${id}`)
            .then((result) => {
                axios
                    .get(`https://digital-discount.co/api/options/${id}`)
                    .then((optionsResult) => {
                        setTitle(result.data[0].title);
                        setRealPrice(result.data[0].real_price);
                        setPricePerMonth(result.data[0].price_per_month);
                        setDescription(result.data[0].description);
                        setCategoryId(result.data[0].category_id);
                        setOptions(optionsResult.data || []);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
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

    const handleOptionChange = (e, index) => {
        const { name, value } = e.target;
        const updatedOptions = [...options];
        updatedOptions[index] = { ...updatedOptions[index], [name]: value };
        setOptions(updatedOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, { option_name: "", option_price: "" }]);
    };

    const handleSubmit = async (e) => {
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

        if (!realPrice.includes("€")) {
            setError("Erreur de format, exemple : 99.99€ sur Spotify");
            return;
        }

        options.forEach((option, index) => {
            formData.append(`option_name_${index}`, option.option_name);
            formData.append(`option_price_${index}`, option.option_price);
        });

        try {
            await axios.put(`https://digital-discount.co/api/update/${id}`, formData);
            navigate("/home/admin");
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (option) => {
        const optionId = option.id;
        setConfirmDelete(optionId);
    };

    const confirmDeleteAction = () => {
        if (confirmDelete) {
            axios
                .delete(`https://digital-discount.co/api/options/${confirmDelete}`)
                .then((res) => {
                    if (res.data.success) {
                        setOptions(options.filter((opt) => opt.id !== confirmDelete));
                        setConfirmDelete(null);
                    } else {
                        alert("Une erreur s'est produite lors de la suppression de l'option.");
                    }
                })
                .catch((err) => console.error(err));
        }
    };

    return (
        <>
            <div className="container my-5">
                <div className="card p-5">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-center">Modifier {title}</h1>
                        <hr />
                        <div className="row justify-content-center">
                            <div className="col-lg-6 my-3">
                                <label htmlFor="title">Titre</label>
                                <input id="title" className="form-control" required type="text" value={title} onChange={handleChange} name="title" placeholder="Titre du produit" />
                            </div>
                            <div className="col-lg-6 my-3">
                                <label htmlFor="image">Image du produit</label>
                                <input id="image" className="form-control" type="file" onChange={handleImageChange} name="image" placeholder="Image du produit" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="price_per_month">Prix par mois</label>
                                <input id="price_per_month" className="form-control" type="text" value={pricePerMonth} onChange={handleChange} name="pricePerMonth" placeholder="Prix par mois" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="real_price">Prix réel</label>
                                <input id="real_price" className="form-control" type="text" value={realPrice} onChange={handleChange} name="realPrice" placeholder="Prix réel" />
                                <div className="text-light text-center bg-danger fw-bolder">{error}</div>
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="category">Catégorie du produit</label>
                                <select id="category" className="form-control" onChange={handleChange} name="categoryId" value={categoryId}>
                                    <option>Sélectionnez une catégorie</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {options.map((option, index) => (
                            <div className="row justify-content-center px-0" key={index}>
                                <div className="col-lg-6 col-md-6 col-sm-12 my-3">
                                    <label htmlFor={`option_name_${index}`}>Option {index + 1} - Nom</label>
                                    <input id={`option_name_${index}`} className="form-control" required type="text" value={option.option_name} onChange={(e) => handleOptionChange(e, index)} name="option_name" placeholder={`Nom de l'option ${index + 1}`} />
                                </div>
                                <div className="col-lg-5 col-md-5 col-sm-12 my-3">
                                    <label htmlFor={`option_price_${index}`}>Option {index + 1} - Prix</label>
                                    <input id={`option_price_${index}`} className="form-control" required type="number" value={option.option_price} onChange={(e) => handleOptionChange(e, index)} name="option_price" placeholder={`Prix de l'option ${index + 1}`} />
                                </div>
                                <div className="col-lg-1 col-md-1 m-auto">
                                    <i className="fa fa-trash" aria-hidden="true" onClick={() => handleDelete(option)}></i>
                                </div>
                            </div>
                        ))}
                        <div className="col-12 my-3">
                            <label htmlFor="description">Description</label>
                            <ReactQuill theme="snow" className="bg-light" id="description" value={description} onChange={setDescription} />
                        </div>
                        <div className="col-12 my-3">
                            <button type="button" className="btn btn-secondary" onClick={handleAddOption}>
                                Ajouter une option
                            </button>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-success w-auto mx-2">Modifier</button>
                            <a href="/home/admin" className="btn btn-danger w-auto">
                                Annuler
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            {confirmDelete && (
                <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", zIndex: "9999", top: "0", bottom: "0", left: "0", right: "0" }}>
                    <div className="modal-dialog" style={{ maxWidth: "400px", margin: "15% auto" }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmation de suppression</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmDelete(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Êtes-vous sûr de vouloir supprimer cette option ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                                    Annuler
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDeleteAction}>
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateAdmin;

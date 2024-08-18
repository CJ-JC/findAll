import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateAdmin = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({
        title: "",
        description: "",
        real_price: "",
        price_per_month: "",
        image: null,
        options: [],
        totalOptions: 0,
        category_id: "",
    });

    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/categories")
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/${id}`)
            .then((result) => {
                axios
                    .get(`http://localhost:8000/api/options/${id}`)
                    .then((optionsResult) => {
                        setProduct({
                            ...product,
                            title: result.data[0].title,
                            real_price: result.data[0].real_price,
                            price_per_month: result.data[0].price_per_month,
                            description: result.data[0].description,
                            image: result.data[0].image,
                            options: optionsResult.data,
                            totalOptions: optionsResult.data.length,
                            category_id: result.data[0].category_id,
                        });
                    })
                    .catch((optionsErr) => console.log(optionsErr));
            })
            .catch((err) => console.log(err));
    }, []);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleOptionChange = (e, index) => {
        const { name, value } = e.target;
        const updatedOptions = [...product.options];
        updatedOptions[index] = { ...updatedOptions[index], [name]: value };
        setProduct({ ...product, options: updatedOptions });
    };

    const handleAddOption = () => {
        const newOptions = [...product.options];
        newOptions.push({ option_name: "", option_price: "" });
        setProduct({ ...product, options: newOptions, totalOptions: product.totalOptions + 1 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", product.title);
        formData.append("real_price", product.real_price);
        formData.append("price_per_month", product.price_per_month);
        formData.append("description", product.description);
        formData.append("image", image);
        formData.append("category_id", product.category_id);

        product.options.forEach((option, index) => {
            formData.append(`option_name_${index}`, option.option_name);
            formData.append(`option_price_${index}`, option.option_price);
        });

        try {
            await axios.put(`http://localhost:8000/api/update/${id}`, formData);
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
                .delete(`http://localhost:8000/api/options/${confirmDelete}`)
                .then((res) => {
                    if (res.data.success) {
                        setProduct((prevProduct) => ({
                            ...prevProduct,
                            options: prevProduct.options.filter((opt) => opt.id !== confirmDelete),
                        }));
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
                        <h1 className="text-center">Modifier {product.title}</h1>
                        <hr />
                        <div className="row justify-content-center">
                            <div className="col-lg-6 my-3">
                                <label htmlFor="title">Titre</label>
                                <input id="title" className="form-control" required type="text" value={product.title} onChange={handleChange} name="title" placeholder="Titre du produit" />
                            </div>
                            <div className="col-lg-6 my-3">
                                <label htmlFor="image">Image du produit</label>
                                <input id="image" className="form-control" type="file" onChange={handleImageChange} name="image" placeholder="Image du produit" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="price_per_month">Prix par mois</label>
                                <input id="price_per_month" className="form-control" type="text" value={product.price_per_month} onChange={handleChange} name="price_per_month" placeholder="Titre du produit" />
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <label htmlFor="real_price">Vrai prix</label>
                                <input id="real_price" className="form-control" type="text" value={product.real_price} onChange={handleChange} name="real_price" placeholder="Titre du produit" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 my-3">
                            <label htmlFor="category">Catégorie du produit</label>
                            <select id="category" className="form-control" onChange={handleChange} name="category_id" value={product.category_id}>
                                <option>Sélectionnez une catégorie</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {product.options.map((option, index) => (
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
                            <textarea id="description" className="form-control" type="text" value={product.description} onChange={handleChange} name="description" placeholder="Description" />
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

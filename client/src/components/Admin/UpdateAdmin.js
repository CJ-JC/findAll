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

    useEffect(() => {
        axios
            .get("https://digital-discount-server-8cnrfax1a-john-does-projects-63a61406.vercel.app//categories")
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    useEffect(() => {
        axios
            .get(`https://digital-discount-server-8cnrfax1a-john-does-projects-63a61406.vercel.app//${id}`)
            .then((result) => {
                axios
                    .get(`https://digital-discount-server-8cnrfax1a-john-does-projects-63a61406.vercel.app//options/${id}`)
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
            await axios.put(`https://digital-discount-server-8cnrfax1a-john-does-projects-63a61406.vercel.app//update/${id}`, formData);
            navigate("/home/admin");
        } catch (error) {
            console.error(error);
        }
    };

    return (
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
                            <div className="col-lg-6 col-md-6 col-sm-12 my-3">
                                <label htmlFor={`option_price_${index}`}>Option {index + 1} - Prix</label>
                                <input id={`option_price_${index}`} className="form-control" required type="number" value={option.option_price} onChange={(e) => handleOptionChange(e, index)} name="option_price" placeholder={`Prix de l'option ${index + 1}`} />
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
                    <button className="btn btn-success w-auto">Modifier</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateAdmin;

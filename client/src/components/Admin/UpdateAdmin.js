import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateAdmin = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({
        title: "",
        description: "",
        image: null,
        options: [],
        totalOptions: 0, // Ajout du nombre total d'options
    });

    const [image, setImage] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8000/${id}`)
            .then((result) => {
                axios
                    .get(`http://localhost:8000/options/${id}`)
                    .then((optionsResult) => {
                        setProduct({
                            ...product,
                            title: result.data[0].title,
                            description: result.data[0].description,
                            image: result.data[0].image,
                            options: optionsResult.data,
                            totalOptions: optionsResult.data.length,
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
        formData.append("description", product.description);
        formData.append("image", image);

        product.options.forEach((option, index) => {
            formData.append(`option_name_${index}`, option.option_name);
            formData.append(`option_price_${index}`, option.option_price);
        });

        try {
            const res = await axios.put(`http://localhost:8000/update/${id}`, formData);
            navigate("/home/admin");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container my-5">
            <div className="card p-5">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-center">Modifier le produit</h1>
                    <hr />
                    <div className="row justify-content-center">
                        <div className="col-6 my-3">
                            <label htmlFor="title">Titre</label>
                            <input id="title" className="form-control" required type="text" value={product.title} onChange={handleChange} name="title" placeholder="Titre du produit" />
                        </div>
                        <div className="col-6 my-3">
                            <label htmlFor="image">Image du produit</label>
                            <input id="image" className="form-control" type="file" onChange={handleImageChange} name="image" placeholder="Image du produit" />
                        </div>
                    </div>
                    {product.options.map((option, index) => (
                        <div className="row justify-content-center px-0" key={index}>
                            <div className="col-lg-6 col-md-6 col-sm-12 my-3">
                                <label htmlFor={`option_name_${index}`}>Option {index + 1} - Nom</label>
                                <input id={`option_name_${index}`} className="form-control" required type="text" value={option.option_name} onChange={(e) => handleOptionChange(e, index)} name="option_name" placeholder={`Nom de l'option ${index + 1}`} />
                                {/* <i className="fa fa-trash" aria-hidden="true" onClick={() => handleRemoveOption(index)}></i> */}
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 my-3">
                                <label htmlFor={`option_price_${index}`}>Option {index + 1} - Prix</label>
                                <input id={`option_price_${index}`} className="form-control" required type="number" value={option.option_price} onChange={(e) => handleOptionChange(e, index)} name="option_price" placeholder={`Prix de l'option ${index + 1}`} />
                            </div>
                        </div>
                    ))}
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

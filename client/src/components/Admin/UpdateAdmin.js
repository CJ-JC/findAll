import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateAdmin = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: "",
        image: null,
    });

    const [image, setImage] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8000/${id}`)
            .then((result) => setProduct({ ...product, title: result.data[0].title, description: result.data[0].description, price: result.data[0].price, image: result.data[0].image }))
            .catch((err) => setProduct(err));
    }, []);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // const handleEditorChange = (event, editor) => {
    //     const data = editor.getData();
    //     setProduct({ ...product, description: data });
    // };

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
            .put(`http://localhost:8000/update/${id}`, formData)
            .then((res) => setProduct(res.data))
            .catch((err) => setProduct(err));
        navigate("/home/admin");
    };

    return (
        <form className="container" onSubmit={handleSubmit}>
            <h1 className=" text-center">Modifier le produit</h1>
            <hr />
            <div className="row justify-content-center">
                <div className="col-6 my-3">
                    <label htmlFor="title">Titre</label>
                    <input id="title" className="form-control" required type="text" value={product.title} onChange={handleChange} name="title" placeholder="Titre du produit" />
                </div>
                <div className="col-6 my-3">
                    <label htmlFor="price">Prix</label>
                    <input id="price" className="form-control" required type="text" value={product.price} onChange={handleChange} name="price" placeholder="Prix du produit" />
                </div>
                <div className="col-6 my-3">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" className="form-control" required type="text" value={product.description} onChange={handleChange} name="description" placeholder="Description du produit" />
                </div>
                <div className="col-6 my-3">
                    <label htmlFor="image">Image du produit</label>
                    <input id="image" className="form-control" type="file" onChange={handleImageChange} name="image" placeholder="Image du produit" />
                </div>
                <button className="btn btn-success w-25">Modifier</button>
            </div>
        </form>
    );
};

export default UpdateAdmin;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { Box, Modal, Button } from "@mui/material";

// const UpdateAdmin = ({ produit }) => {
//     const navigate = useNavigate();
//     const { id } = useParams();

//     const [product, setProduct] = useState({
//         title: produit.title || "",
//         description: produit.description || "",
//         price: produit.price || "",
//         image: produit.image || null,
//     });

//     const [image, setImage] = useState(null);

//     useEffect(() => {
//         axios
//             .get(`http://localhost:8000/${id}`)
//             .then((result) => setProduct({ ...product, title: result.data[0].title, description: result.data[0].description, price: result.data[0].price, image: result.data[0].image }))
//             .catch((err) => console.error(err)); // Gestion des erreurs à améliorer
//     }, []);

//     const handleChange = (e) => {
//         setProduct({ ...product, [e.target.name]: e.target.value });
//     };

//     const handleImageChange = (e) => {
//         setImage(e.target.files[0]);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const formData = new FormData();

//         formData.append("title", product.title);
//         formData.append("description", product.description);
//         formData.append("price", product.price);
//         formData.append("image", image);

//         axios
//             .put(`http://localhost:8000/update/${id}`, formData)
//             .then((res) => setProduct(res.data))
//             .catch((err) => console.error(err)); // Gestion des erreurs à améliorer
//         navigate("/");
//     };

//     const handleClose = () => setOpen(false);
//     const handleOpen = () => setOpen(true);

//     const [open, setOpen] = useState(false);

//     const style = {
//         position: "absolute",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         width: "70%",
//         bgcolor: "rgb(17 20 29)",
//         boxShadow: 24,
//         color: "white",
//         border: "1px solid #fff",
//         p: 4,
//     };

//     return (
//         <>
//             <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
//                 <Box sx={style}>
//                     <form className="container" onSubmit={handleSubmit}>
//                         <h1 className=" text-center">Modifier le produit</h1>
//                         <hr />
//                         <div className="row justify-content-center">
//                             <div className="col-6 my-3">
//                                 <label htmlFor="title">Titre</label>
//                                 <input id="title" className="form-control" required type="text" value={product.title} onChange={handleChange} name="title" placeholder="Titre du produit" />
//                             </div>
//                             <div className="col-6 my-3">
//                                 <label htmlFor="price">Prix</label>
//                                 <input id="price" className="form-control" required type="text" value={product.price} onChange={handleChange} name="price" placeholder="Prix du produit" />
//                             </div>
//                             <div className="col-6 my-3">
//                                 <label htmlFor="description">Description</label>
//                                 <textarea id="description" className="form-control" required type="text" value={product.description} onChange={handleChange} name="description" placeholder="Description du produit" />
//                             </div>
//                             <div className="col-6 my-3">
//                                 <label htmlFor="image">Image du produit</label>
//                                 <input id="image" className="form-control" required type="file" onChange={handleImageChange} name="image" />
//                             </div>
//                             <button className="btn btn-success w-25">Modifier</button>
//                         </div>
//                     </form>
//                 </Box>
//             </Modal>
//             <Link className="btn btn-warning d-inline-flex align-items-center" onClick={handleOpen}>
//                 <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path d="m19.4 7.337-2.74-2.74a2 2 0 0 0-2.66-.07l-9 9a2 2 0 0 0-.57 1.21L4 18.907a1 1 0 0 0 1 1.09h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.617l-3 .28.27-3L12 9.317l2.7 2.7-5.62 5.6Zm6.92-6.94-2.68-2.68 1.95-2L18 8.727l-2 1.95Z"></path>
//                 </svg>
//             </Link>
//         </>
//     );
// };

// export default UpdateAdmin;

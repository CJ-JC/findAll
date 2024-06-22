import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modalopen from "../Modal/Modal";
import Create from "../Create";
import Footer from "../Footer";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "rgb(17 20 29)",
    boxShadow: 24,
    color: "white",
    border: "1px solid #fff",
    p: 4,
};

const HomeAdmin = () => {
    const [products, setProducts] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null); // État pour gérer la confirmation de suppression

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:8000/")
            .then((result) => setProducts(result.data))
            .catch((err) => setProducts(err));
    }, []);

    const handleDelete = (id) => {
        setConfirmDelete(id); // Ouvrir la boîte de dialogue de confirmation
    };

    const confirmDeleteAction = () => {
        if (confirmDelete) {
            axios
                .delete(`http://localhost:8000/delete/${confirmDelete}`)
                .then((result) => {
                    setProducts(products.filter((product) => product.id !== confirmDelete));
                    setConfirmDelete(null); // Réinitialiser l'état après suppression
                })
                .catch((err) => console.error(err));
        }
    };

    return (
        <>
            <div className="container my-5">
                <div className="d-flex justify-content-between m-4">
                    <h1>Liste des produits</h1>
                    <Create handleClose={handleClose} handleOpen={handleOpen} open={open} setOpen={setOpen} style={style} />
                </div>
                <hr className="text-light w-75 mx-auto" />
                <div className="row justify-content-center">
                    {products.map((product) => (
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 my-3 px-0 list_product" key={product.id}>
                            <div className="card" style={{ height: "280px" }}>
                                <img className="card-img-top" src={`http://localhost:8000/upload/${product.image}`} alt={product.title} />
                                <div className="icon">
                                    <div className="row">
                                        <div className="col-4">
                                            <Modalopen product={product} handleClose={handleClose} handleOpen={handleOpen} open={open} style={style} />
                                        </div>
                                        <div className="col-4">
                                            <Link className="btn btn-warning d-inline-flex align-items-center" to={`/update/admin/${product.id}`}>
                                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m19.4 7.337-2.74-2.74a2 2 0 0 0-2.66-.07l-9 9a2 2 0 0 0-.57 1.21L4 18.907a1 1 0 0 0 1 1.09h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.617l-3 .28.27-3L12 9.317l2.7 2.7-5.62 5.6Zm6.92-6.94-2.68-2.68 1.95-2L18 8.727l-2 1.95Z"></path>
                                                </svg>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <button className="btn btn-danger d-inline-flex align-items-center" onClick={() => handleDelete(product.id)}>
                                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21 6.001h-5v-1.67a2.42 2.42 0 0 0-2.5-2.33h-3A2.42 2.42 0 0 0 8 4.331v1.67H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-11h1a1 1 0 1 0 0-2Zm-11-1.67c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33v1.67h-4v-1.67Zm8 14.67a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-11h12v11Z"></path>
                                                    <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 1 0-2 0v4a1 1 0 0 0 1 1Z"></path>
                                                    <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1Z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h6 className="card-title">{product.title}</h6>
                                    {product.options.length > 0 && (
                                        <div>
                                            <h6 className="card-text">{product.options[0].option_price}€</h6>
                                        </div>
                                    )}
                                    {product.real_price ? (
                                        <div>
                                            <p className="m-0">soit {product.price_per_month}€ / mois</p>
                                            <p className="m-0">{product.real_price}€</p>
                                        </div>
                                    ) : (
                                        <p className="m-0">soit {product.price_per_month}€ / mois</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Boîte de dialogue modale de confirmation */}
            {confirmDelete && (
                <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", zIndex: "9999", top: "0", bottom: "0", left: "0", right: "0" }}>
                    <div className="modal-dialog" style={{ maxWidth: "400px", margin: "15% auto" }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmation de suppression</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmDelete(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
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

            <Footer />
        </>
    );
};

export default HomeAdmin;

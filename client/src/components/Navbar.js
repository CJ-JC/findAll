import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn, paragraphRef }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        // Mettre à jour l'état pour indiquer que l'utilisateur n'est plus connecté
        setIsLoggedIn(false);
        navigate("/");
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg p-0">
            <div className="container">
                <NavLink className="navbar-brand" to="/">
                    <img className="logo" src="../img/logo.png" alt="" />
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Accueil
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                onClick={() =>
                                    window.scrollTo({
                                        top: paragraphRef.current.offsetTop,
                                        behavior: "smooth",
                                    })
                                }
                            >
                                Contact
                            </NavLink>
                        </li>
                        {isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/home/admin">
                                        Admin
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger" onClick={handleLogout}>
                                        Déconnexion
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            setScrolled(isScrolled);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg p-0 ${scrolled ? "scrolled" : ""}`}>
            <div className="container">
                <NavLink className="navbar-brand" to="/">
                    Stream XYZ
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className={`nav-link ${({ isActive }) => (isActive ? "active" : "")}`} to="/">
                                Accueil
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={`nav-link ${({ isActive }) => (isActive ? "active" : "")}`} to="/contact">
                                Contact
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={`nav-link ${({ isActive }) => (isActive ? "active" : "")}`} to="/home/admin">
                                Admin
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

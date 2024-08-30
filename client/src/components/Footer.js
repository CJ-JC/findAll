import React from "react";

const Footer = () => {
    const year = new Date();

    return (
        <div className="container footer">
            <div className="footer-basic">
                <footer>
                    <div className="social">
                        <a href="#">
                            <i className="icon ion-social-instagram"></i>
                        </a>
                        <a href="#">
                            <i className="icon ion-social-snapchat"></i>
                        </a>
                        <a href="https://t.me/digitaldiscount1" target="_blank">
                            <i className="fa fa-paper-plane"></i>
                        </a>
                    </div>
                    <ul className="list-inline">
                        <li className="list-inline-item">
                            <a href="/">Accueil</a>
                        </li>
                        <li className="list-inline-item">
                            <a href="/politique">Conditions</a>
                        </li>
                    </ul>
                    <p className="copyright">Digital Discount © {year.getFullYear()}</p>
                </footer>
            </div>
        </div>
    );
};

export default Footer;

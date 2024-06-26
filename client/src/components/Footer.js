import React from "react";

const Footer = () => {
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
                        <a href="#">
                            <i className="icon ion-social-twitter"></i>
                        </a>
                        <a href="https://t.me/ecotunes" target="_blank">
                            <i className="fa fa-paper-plane"></i>
                        </a>
                    </div>
                    <ul className="list-inline">
                        <li className="list-inline-item">
                            <a href="/">Home</a>
                        </li>
                        <li className="list-inline-item">
                            <a href="#">About</a>
                        </li>
                        <li className="list-inline-item">
                            <a href="/politique">Conditions</a>
                        </li>
                    </ul>
                    <p className="copyright">ÉcoTunes © 2024</p>
                </footer>
            </div>
        </div>
    );
};

export default Footer;

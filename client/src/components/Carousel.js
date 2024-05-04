import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const Carousel = () => {
    const [options, setOptions] = useState({
        loop: true,
        items: 1,
        margin: 0,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        animateIn: "fadeIn",
        animateOut: "fadeOut",
    });

    useEffect(
        () => {
            // Code pour récupérer les données ou les effets secondaires
            // que vous aviez dans UNSAFE_componentWillReceiveProps
        },
        [
            /* Les dépendances à surveiller pour déclencher cette mise à jour */
        ]
    );

    return (
        <OwlCarousel className="owl-theme" {...options}>
            {/* <div className="item">
                <img src="../img/home.jpg" alt="" />
            </div> */}
            <div className="item">
                <img src="../img/bg-disney.avif" alt="" />
            </div>
            <div className="item">
                <img src="../img/bg-hbo.jpeg" alt="" />
            </div>
            <div className="item">
                <img src="../img/bg-netflix.jpeg" alt="" />
            </div>
            <div className="item">
                <img src="../img/bg-tidal.jpeg" alt="" />
            </div>
            <div className="item">
                <img src="../img/bg-amazon.png" alt="" />
            </div>
        </OwlCarousel>
    );
};

export default Carousel;

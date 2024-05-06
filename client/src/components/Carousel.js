import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const Carousel = () => {
    const images = [
        // {
        //     img: "../img/home.jpg",
        // },
        {
            img: "../img/bg-disney.avif",
        },
        {
            img: "../img/bg-hbo.jpeg",
        },
        {
            img: "../img/bg-netflix.jpeg",
        },
        {
            img: "../img/bg-tidal.jpeg",
        },
        {
            img: "../img/bg-amazon.png",
        },
    ];

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

    return (
        <OwlCarousel className="owl-theme" {...options}>
            {images.map((image, index) => (
                <div className="item" key={index}>
                    <img src={image.img} alt="" />
                </div>
            ))}
        </OwlCarousel>
    );
};

export default Carousel;

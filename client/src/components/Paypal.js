import React, { useRef, useEffect } from "react";

export default function Paypal({ product, totalPrice }) {
    const paypal = useRef();

    useEffect(() => {
        if (paypal.current) {
            paypal.current.innerHTML = ""; // Effacer le contenu précédent avant de recréer le bouton
        }

        window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: product.title,
                                amount: {
                                    currency_code: "EUR",
                                    value: totalPrice,
                                },
                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    console.log(order);
                },
                onError: (err) => {
                    console.log(err);
                },
            })
            .render(paypal.current);
    }, [product, totalPrice]);

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    );
}

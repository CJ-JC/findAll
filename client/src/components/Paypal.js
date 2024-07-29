import React, { useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Paypal({ product, totalPrice, quantity, selectedOptions }) {
    const paypal = useRef();
    const navigate = useNavigate("");
    const selectedOption = product.options.find((option) => option.id == selectedOptions);

    useEffect(() => {
        if (paypal.current) {
            paypal.current.innerHTML = "";
        }

        window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: `${selectedOption.option_name} - Quantité: ${quantity}`,
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
                    const body = { email: order.payer.email_address, description: order.purchase_units[0].description };

                    const headers = {
                        "Content-Type": "application/json",
                    };
                    try {
                        await axios.post("https://digital-discount-server.vercel.app//success/payment", body, { headers });
                        navigate(`/success/${order.id}`, { state: { email: order.payer.email_address } });
                    } catch (error) {
                        console.error("Erreur lors de l'appel de la requête de succès:", error);
                    }
                },
                onError: (err) => {
                    console.log(err);
                },
            })
            .render(paypal.current);
    }, [selectedOptions, product, totalPrice]);

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    );
}

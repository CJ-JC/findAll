import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

export default function CheckoutForm({ product, totalPrice }) {
    const makePayment = async () => {
        const stripe = await loadStripe("pk_test_51Js9DlAyX4TjGLxtV7XzCNGGCRF4k4MzjJ8m41jxEY5Z72RS9MT8vBjNyzGl7ZPdT6Gx9EFTO8LF659AAElk2FvQ00WFkCH1Pg");
        const body = { product, totalPrice };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        try {
            const response = await axios.post("https://digital-discount-server.vercel.app//api/create-checkout-session", body, { headers });
            const session = response.data;

            const result = stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                console.log(result.error);
            }
        } catch (error) {
            console.error("Erreur lors de la demande de paiement:", error);
        }
    };

    return (
        <button className="btn btn-light fw-bold w-auto mt-4 mx-auto" onClick={makePayment}>
            Payer {totalPrice}€
        </button>
    );
}

// npm i @chakra-ui/react

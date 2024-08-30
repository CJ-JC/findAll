import React, { useState } from "react";

const Politique = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="container mt-5">
            <h3>Conditions d'utilisation</h3>
            <br />
            <ul className="m-0 text-light">
                <li>🛒 Veuillez lire nos conditions d'utilisation et nos FAQ avant d'acheter.</li>
                <li>📚 Conditions d'utilisation</li>
                <li>Acceptation et responsabilité : En utilisant nos services, vous acceptez ces termes et conditions et assumez toute responsabilité.</li>
                <li>Garanties ou compensation : Nos produits sont accompagnés d'une garantie pour garantir la satisfaction du client.</li>
                <li>Confidentialité : Ne divulguez pas d’informations privées au public.</li>
                <li>
                    Litiges de paiement : tous les paiements sont définitifs et nous n'effectuons aucun remboursement à moins que nous ne soyons pas en mesure de vous fournir un remplacement. <br /> Toute contestation d'un paiement entraînera un bannissement permanent de notre serveur et une éventuelle résiliation des services.
                </li>
                <li>Conformité et légalité : tous nos produits proviennent de sources légales et nous ne soutenons aucune activité illégale.</li>
                <li>Modifications de politique : nous nous réservons le droit de mettre à jour nos conditions d'utilisation.</li>
                <li>Interdiction de non-acceptation : Si vous n'acceptez pas ces conditions, il vous est interdit d'utiliser nos services.</li>
            </ul>
            <p>
                <i>
                    Nous contacter : serveur de telegram{" "}
                    <a href="https://t.me/digitaldiscount1" target="_blank" className="fw-bold text-light">
                        <u>
                            <i className="fa fa-paper-plane"></i> Digital-discount
                        </u>
                    </a>
                </i>
            </p>
        </div>
    );
};

export default Politique;

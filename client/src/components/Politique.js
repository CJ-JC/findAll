import React, { useState } from "react";

const Politique = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <h3>Conditions d'utilisation</h3>
            <br />
            <ul className="m-0 text-light">
                <li>🛒 Veuillez lire nos conditions d'utilisation et nos FAQ avant d'acheter.</li>
                <li>📚 Conditions d'utilisation</li>
                <li>Acceptation et responsabilité : En utilisant nos services, vous acceptez ces termes et conditions et assumez toute responsabilité.</li>
                <li>Garanties ou compensation : Nos produits sont accompagnés d'une garantie pour garantir la satisfaction du client.</li>
            </ul>
            <div className="collapse" id="collapseExample">
                <ul className="text-light">
                    <li>Confidentialité : Ne divulguez pas d’informations privées au public.</li>
                    <li>
                        Pas de spam ou d'inondation : veuillez éviter les messages excessifs ou le contenu perturbateur. <br /> Cela inclut le spam et l’inondation de contenus non pertinents dans les tickets d’assistance.
                    </li>
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
                        <a href="https://t.me/discountdigital" target="_blank" className="fw-bold text-light">
                            <u>
                                <i className="fa fa-paper-plane"></i> Digital-discount
                            </u>
                        </a>
                    </i>
                </p>
            </div>
            <p>
                <button className="btn btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded={isExpanded} aria-controls="collapseExample" onClick={handleToggle}>
                    {isExpanded ? "Lire moins" : "En savoir plus"}
                </button>
            </p>
        </>
    );
};

export default Politique;

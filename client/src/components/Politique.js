import React from "react";
import Footer from "./Footer";

const Politique = () => {
    return (
        <>
            <h3>Conditions d'utilisation</h3>
            <ol className="m-0">
                <li>🛒 Veuillez lire nos conditions d'utilisation et nos FAQ avant d'acheter.</li>
                <li>📚 Conditions d'utilisation</li>
                <li>Acceptation et responsabilité : En utilisant nos services, vous acceptez ces termes et conditions et assumez toute responsabilité.</li>
                <li>Garanties ou compensation : Nos produits sont accompagnés d'une garantie pour garantir la satisfaction du client.</li>
            </ol>
            <div className="collapse" id="collapseExample">
                <ol>
                    <li>Confidentialité : Ne divulguez pas d’informations privées au public.</li>
                    <li>Pas de spam ou d'inondation : veuillez éviter les messages excessifs ou le contenu perturbateur. Cela inclut le spam et l’inondation de contenus non pertinents dans les tickets d’assistance.</li>
                    <li>Litiges de paiement : tous les paiements sont définitifs et nous n'effectuons aucun remboursement à moins que nous ne soyons pas en mesure de vous fournir un remplacement. Toute contestation d'un paiement entraînera un bannissement permanent de notre serveur et une éventuelle résiliation des services.</li>
                    <li>Conformité et légalité : tous nos produits proviennent de sources légales et nous ne soutenons aucune activité illégale.</li>
                    <li>Modifications de politique : nous nous réservons le droit de mettre à jour nos conditions d'utilisation.</li>
                    <li>Interdiction de non-acceptation : Si vous n'acceptez pas ces conditions, il vous est interdit d'utiliser nos services.</li>
                </ol>
                <p>
                    <u>Nous joindre</u> : serveur de telegram
                </p>
            </div>
            <p>
                <button className="btn btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    En savoir plus
                </button>
            </p>
        </>
    );
};

export default Politique;

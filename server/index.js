const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const env = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const stripe = require("stripe")("sk_test_51Js9DlAyX4TjGLxtmuUeqjjAF2KU4OqeSOnMWdxlcztKt9EGznhefcAu29JddGvjdSUhVHTr3MM6D4dsRkiPZzop003jVRBV7E");
const emailRoutes = require("./routes/emailRoutes");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const smtpTransport = require("nodemailer-smtp-transport");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
env.config();
app.use(bodyParser.json());

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};

const db = mysql.createConnection({
    host: "b0uq9hqybv7bqqoiyg75-mysql.services.clever-cloud.com",
    user: "uyf9wearp2cjslug",
    password: "8QazP208HSgQ7bcPfwvN",
    port: 3306,
    database: "b0uq9hqybv7bqqoiyg75",
});

const PORT = process.env.PORT || "https://digital-discount-server.vercel.app";

app.use("/email", emailRoutes);

app.get("/", (req, res) => {
    const sql = "SELECT * FROM product";

    db.query(sql, (err, products) => {
        if (err) {
            return res.json({ Message: "Error" });
        }

        // Récupérer les options pour chaque produit
        const productsWithOptions = products.map(async (product) => {
            const optionsSql = "SELECT * FROM type INNER JOIN product_type ON type.id = product_type.type_id WHERE product_type.product_id = ?";
            const optionsValues = [product.id];

            const options = await new Promise((resolve, reject) => {
                db.query(optionsSql, optionsValues, (err, options) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(options);
                    }
                });
            });

            return { ...product, options };
        });

        Promise.all(productsWithOptions)
            .then((result) => res.json(result))
            .catch((err) => res.json({ Message: "Error fetching options", Error: err }));
    });
});

app.get("/categories", (req, res) => {
    const sql = "SELECT * FROM category";

    db.query(sql, (err, categories) => {
        if (err) {
            return res.json({ Message: "Error" });
        }

        res.json(categories);
    });
});

app.get("/products/:categoryId", (req, res) => {
    const categoryId = req.params.categoryId;
    let sql;
    let values;

    if (categoryId === "all") {
        sql = "SELECT * FROM product";
        values = [];
    } else {
        sql = "SELECT * FROM product WHERE category_id = ?";
        values = [categoryId];
    }

    db.query(sql, values, (err, products) => {
        if (err) {
            return res.json({ Message: "Error" });
        }

        // Récupérer les options pour chaque produit
        const productsWithOptions = products.map(async (product) => {
            const optionsSql = "SELECT * FROM type INNER JOIN product_type ON type.id = product_type.type_id WHERE product_type.product_id = ?";
            const optionsValues = [product.id];

            const options = await new Promise((resolve, reject) => {
                db.query(optionsSql, optionsValues, (err, options) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(options);
                    }
                });
            });

            return { ...product, options };
        });

        Promise.all(productsWithOptions)
            .then((result) => res.json(result))
            .catch((err) => res.json({ Message: "Error fetching options", Error: err }));
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "public/upload";
        // Vérifier si le répertoire existe
        if (!fs.existsSync(uploadDir)) {
            // S'il n'existe pas, le créer
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.post("/create", upload.single("image"), (req, res) => {
    const { title, real_price, price_per_month, description, category_id } = req.body;
    const image = req.file.filename;

    // Insertion du produit dans la base de données
    const productSql = "INSERT INTO product (`title`, `real_price`, `price_per_month`, `description`, `category_id`, `image`) VALUES (?, ?, ?, ?, ?, ?)";
    const productValues = [title, real_price, price_per_month, description, category_id, image];

    db.query(productSql, productValues, (err, productResult) => {
        if (err) {
            return res.json(err);
        }

        const productId = productResult.insertId;

        // Insertion des options dans la base de données et création des liens dans la table product_type
        Object.keys(req.body).forEach((key) => {
            if (key.startsWith("option_name_")) {
                const index = key.split("_")[2];
                const option_name = req.body[`option_name_${index}`];
                const option_price = req.body[`option_price_${index}`];

                // Insérer l'option dans la table type
                const optionSql = "INSERT INTO type (option_name, option_price) VALUES (?, ?)";
                const optionValues = [option_name, option_price];
                db.query(optionSql, optionValues, (optionErr, optionResult) => {
                    if (optionErr) {
                        return res.json(optionErr);
                    }
                    const optionId = optionResult.insertId;

                    // Créer le lien dans la table product_type
                    const productTypeSql = "INSERT INTO product_type (product_id, type_id) VALUES (?, ?)";
                    const productTypeValues = [productId, optionId];
                    db.query(productTypeSql, productTypeValues, (productTypeErr, productTypeResult) => {
                        if (productTypeErr) {
                            return res.json(productTypeErr);
                        }
                    });
                });
            }
        });

        return res.json({ Status: "Success" });
    });
});

app.get("/:id", (req, res) => {
    const sql = "SELECT * FROM product WHERE id =?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
    });
});

app.get("/options/:id", (req, res) => {
    const productId = req.params.id;

    const optionsSql = "SELECT type.option_name, type.option_price FROM type INNER JOIN product_type ON type.id = product_type.type_id WHERE product_type.product_id = ?";
    db.query(optionsSql, [productId], (err, options) => {
        if (err) {
            return res.json({ Message: "Error fetching options", Error: err });
        }
        return res.json(options);
    });
});

app.put("/update/:id", upload.single("image"), (req, res) => {
    const id = req.params.id;
    const { title, real_price, price_per_month, description, category_id } = req.body;
    let image = req.file ? req.file.filename : null;

    let sql;
    let values;
    let deleteOptionsSql;
    let optionSql;
    let productTypeSql;
    let deleteOptionsValues;
    let optionValues;
    let productTypeValues;

    if (image) {
        sql = "UPDATE product SET `title` = ?, `real_price` = ?, `price_per_month` = ?, `description` = ?, `category_id` = ?, `image` = ? WHERE id = ?";
        values = [title, real_price, price_per_month, description, category_id, image, id];
    } else {
        sql = "UPDATE product SET `title` = ?, `real_price` = ?, `price_per_month` = ?, `description` = ?, `category_id` = ? WHERE id = ?";
        values = [title, real_price, price_per_month, description, category_id, id];
    }

    // Supprimer les options existantes liées à ce produit
    deleteOptionsSql = "DELETE FROM product_type WHERE product_id = ?";
    deleteOptionsValues = [id];

    db.query(deleteOptionsSql, deleteOptionsValues, (deleteErr, deleteResult) => {
        if (deleteErr) {
            return res.json(deleteErr);
        }

        // Mettre à jour le produit
        db.query(sql, values, (err, result) => {
            if (err) {
                return res.json({ Message: "Error" });
            }

            // Insérer ou mettre à jour les options liées à ce produit
            Object.keys(req.body).forEach((key) => {
                if (key.startsWith("option_name_")) {
                    const index = key.split("_")[2];
                    const option_name = req.body[`option_name_${index}`];
                    const option_price = req.body[`option_price_${index}`];

                    // Vérifier si l'option existe déjà dans la table type
                    optionSql = "SELECT id FROM type WHERE option_name = ?";
                    optionValues = [option_name];

                    db.query(optionSql, optionValues, (optionErr, optionResult) => {
                        if (optionErr) {
                            return res.json(optionErr);
                        }

                        let optionId;

                        if (optionResult.length > 0) {
                            // L'option existe déjà, récupérer son ID
                            optionId = optionResult[0].id;

                            // Mettre à jour l'option (nom et prix)
                            const updateOptionSql = "UPDATE type SET option_name = ?, option_price = ? WHERE id = ?";
                            const updateOptionValues = [option_name, option_price, optionId];

                            db.query(updateOptionSql, updateOptionValues, (updateErr, updateResult) => {
                                if (updateErr) {
                                    return res.json(updateErr);
                                }

                                // Créer le lien dans la table product_type
                                productTypeSql = "INSERT INTO product_type (`product_id`, `type_id`) VALUES (?, ?)";
                                productTypeValues = [id, optionId];

                                db.query(productTypeSql, productTypeValues, (productTypeErr, productTypeResult) => {
                                    if (productTypeErr) {
                                        return res.json(productTypeErr);
                                    }
                                });
                            });
                        } else {
                            // L'option n'existe pas, l'insérer
                            const insertOptionSql = "INSERT INTO type (`option_name`, `option_price`) VALUES (?, ?)";
                            const insertOptionValues = [option_name, option_price];

                            db.query(insertOptionSql, insertOptionValues, (insertErr, insertResult) => {
                                if (insertErr) {
                                    return res.json(insertErr);
                                }

                                optionId = insertResult.insertId;

                                // Créer le lien dans la table product_type
                                productTypeSql = "INSERT INTO product_type (`product_id`, `type_id`) VALUES (?, ?)";
                                productTypeValues = [id, optionId];

                                db.query(productTypeSql, productTypeValues, (productTypeErr, productTypeResult) => {
                                    if (productTypeErr) {
                                        return res.json(productTypeErr);
                                    }
                                });
                            });
                        }
                    });
                }
            });

            return res.json({ Message: "Success" });
        });
    });
});

app.delete("/delete/:id", (req, res) => {
    const productId = req.params.id;

    // Commencer une transaction
    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            return res.json({ Message: "Error starting transaction" });
        }

        // Supprimer les liens dans la table product_type
        const deleteProductTypeSql = "DELETE FROM product_type WHERE product_id = ?";
        db.query(deleteProductTypeSql, [productId], (deleteProductTypeErr, deleteProductTypeResult) => {
            if (deleteProductTypeErr) {
                // En cas d'erreur, annuler la transaction
                return db.rollback(() => {
                    res.json({ Message: "Error deleting product_type" });
                });
            }

            // Supprimer les options dans la table type qui ne sont plus liées à aucun produit
            const deleteOrphanOptionsSql = "DELETE FROM type WHERE id NOT IN (SELECT DISTINCT type_id FROM product_type)";
            db.query(deleteOrphanOptionsSql, (deleteOrphanOptionsErr, deleteOrphanOptionsResult) => {
                if (deleteOrphanOptionsErr) {
                    // En cas d'erreur, annuler la transaction
                    return db.rollback(() => {
                        res.json({ Message: "Error deleting orphan options" });
                    });
                }

                // Supprimer le produit de la table product
                const deleteProductSql = "DELETE FROM product WHERE id = ?";
                db.query(deleteProductSql, [productId], (deleteProductErr, deleteProductResult) => {
                    if (deleteProductErr) {
                        // En cas d'erreur, annuler la transaction
                        return db.rollback(() => {
                            res.json({ Message: "Error deleting product" });
                        });
                    }

                    // Valider la transaction si tout s'est bien passé
                    db.commit((commitErr) => {
                        if (commitErr) {
                            return res.json({ Message: "Error committing transaction" });
                        }
                        res.json({ Status: "Success", Message: "Product deleted successfully" });
                    });
                });
            });
        });
    });
});

// async function createStripeCustomer(email, name) {
//     try {
//         const customer = await stripe.customers.create({
//             email: email,
//             name: name,
//         });
//         return customer;
//     } catch (err) {
//         console.error(err);
//         return null;
//     }
// }

// app.post("/api/create-checkout-session", cors("Access-Control-Allow-Origin", "*"), async (req, res) => {
//     const { email, name, product, totalPrice } = req.body;

//     // Créer le client Stripe
//     const customer = await createStripeCustomer(email, name);

//     if (!customer) {
//         return res.status(500).send("Une erreur s'est produite lors de la création du client Stripe.");
//     }

//     const stripeCustomerId = customer.id;
//     const id = product.id;

//     try {
//         const session = await stripe.checkout.sessions.create({
//             customer: stripeCustomerId,
//             payment_method_types: ["card"],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "eur",
//                         product_data: {
//                             name: product.title,
//                         },
//                         unit_amount: Math.round(totalPrice * 100),
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: "payment",
//             success_url: `http://localhost:3000/success/{CHECKOUT_SESSION_ID}`,
//             cancel_url: "http://localhost:3000/",
//         });

//         res.json({ id: session.id });
//     } catch (err) {
//         res.status(500).send("Une erreur s'est produite lors de la création de la session de paiement.");
//     }
// });

app.get("/product/:id", (req, res) => {
    const sql = "SELECT * FROM product WHERE id =?";
    const id = req.params.id;
    db.query(sql, [id], (err, products) => {
        if (err) {
            return res.json({ Message: "Error" });
        }

        // Récupérer les options pour chaque produit
        const productsWithOptions = products.map(async (product) => {
            const optionsSql = "SELECT * FROM type INNER JOIN product_type ON type.id = product_type.type_id WHERE product_type.product_id = ?";
            const optionsValues = [product.id];

            const options = await new Promise((resolve, reject) => {
                db.query(optionsSql, optionsValues, (err, options) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(options);
                    }
                });
            });

            return { ...product, options };
        });

        Promise.all(productsWithOptions)
            .then((result) => res.json(result))
            .catch((err) => res.json({ Message: "Error fetching options", Error: err }));
    });
});

let emailsSent = {};
app.post("/success/payment", async (req, res) => {
    try {
        const userEmail = "donypaul95@gmail.com";
        const description = req.body.description;

        // Vérifiez si le courriel a déjà été envoyé
        if (emailsSent[userEmail]) {
            return res.json({ message: "Le courriel a déjà été envoyé." });
        }

        // Marquez l'e-mail comme envoyé
        emailsSent[userEmail] = true;

        // Envoyer un e-mail au client
        const transporter = nodemailer.createTransport(
            // Configurer le transporteur SMTP ou un autre service de messagerie pris en charge
            smtpTransport({
                service: "gmail",
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: "lornajules2@gmail.com",
                    pass: "sopopxlrrkrsbudy",
                },
            })
        );

        const mailOptions = {
            from: "lornajules2@gmail.com",
            to: userEmail,
            cc: "lornajules2@gmail.com",
            subject: "Confirmation de paiement",
            html: `
            <p>Bonjour,</p>
            <p>Nous tenons à vous informer que votre paiement a été effectué avec succès. Nous reviendrons vers vous au plus vite pour "${description}".</p> 
            <p>Merci d'avoir choisi notre service !</p>
            <p>Si vous avez des questions ou avez besoin d'assistance, n'hésitez pas à nous contacter.</p>
            <p>Cordialement,</p>
            <p>Votre équipe ÉcoTunes</p>
        `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Erreur lors de l'envoi de l'email :", error);
            } else {
                console.log("Email envoyé :", info.response);
            }
        });

        res.json({ message: "L'e-mail de confirmation a été envoyé avec succès." });
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        res.status(500).send("Une erreur s'est produite lors de l'envoi de l'e-mail.");
    }
});

// stripe
// app.get("/success/:id", async (req, res) => {
//     const { id } = req.params;

//     try {
//         // Récupérez la session de paiement à partir de l'ID
//         const session = await stripe.checkout.sessions.retrieve(id);

//         // Vérifiez si la session est active
//         if (session.payment_status !== "paid") {
//             throw new Error("La session de paiement n'a pas été payée.");
//         }

//         // Récupérez les détails de facturation de la session
//         const userEmail = session.customer_details.email;

//         // Vérifiez si le courriel a déjà été envoyé
//         if (emailsSent[userEmail]) {
//             return res.json({ message: "Le courriel a déjà été envoyé." });
//         }

//         // Marquez l'e-mail comme envoyé
//         emailsSent[userEmail] = true;

//         // Envoyer un e-mail au client
//         const transporter = nodemailer.createTransport(
//             // Configurer le transporteur SMTP ou un autre service de messagerie pris en charge
//             smtpTransport({
//                 service: "gmail",
//                 host: process.env.SMTP_HOST,
//                 port: process.env.SMTP_PORT,
//                 auth: {
//                     user: "lornajules2@gmail.com",
//                     pass: "garkflvsnpfabmbe",
//                 },
//             })
//         );

//         const mailOptions = {
//             from: "cjmfia29@gmail.com",
//             to: userEmail,
//             subject: "Confirmation de paiement",
//             html: `
//             <p>Bonjour,</p>
//             <p>Nous tenons à vous informer que votre paiement a été effectué avec succès. Nous reviendrons vers vous au plus vite</p>
//             <p>Merci d'avoir choisi notre service !</p>
//             <p>Si vous avez des questions ou avez besoin d'assistance, n'hésitez pas à nous contacter.</p>
//             <p>Cordialement,</p>
//             <p>Votre équipe ÉcoTunes</p>
//         `,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log("Erreur lors de l'envoi de l'email :", error);
//             } else {
//                 console.log("Email envoyé :", info.response);
//             }
//         });

//         res.json({ message: "L'e-mail de confirmation a été envoyé avec succès." });
//     } catch (error) {
//         console.error("Une erreur s'est produite :", error);
//         res.status(500).send("Une erreur s'est produite lors de l'envoi de l'e-mail.");
//     }
// });

const jwt = require("jsonwebtoken");

// Générer un token JWT lors de la connexion réussie
app.post("/login", (req, res) => {
    const sql = "SELECT * FROM login WHERE email =?";
    const values = [req.body.email];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json(err);
        }

        if (!result.length) {
            return res.status(401).json("Aucun utilisateur ne correspond à ce compte.");
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, result[0].password);

        if (!passwordIsValid) {
            return res.status(401).json("Email ou mot de passe incorrect");
        }
        // Créer un token avec l'email de l'utilisateur
        const token = jwt.sign({ email: req.body.email }, "secret_key", { expiresIn: "1h" });

        // Envoyer le token en réponse
        return res.json({ message: "Connexion réussie", token: token });
    });
});

// Endpoint pour la déconnexion
app.post("/logout", (req, res) => {
    res.json({ Message: "Logged out successfully" });
});

// app.get("/*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/build", "index.html"), (err) => {
//         if (err) {
//             console.error("Error serving index.html:", err);
//             res.status(500).send("Error serving the React app");
//         }
//     });
// });

app.listen(PORT, (req, res) => {
    console.log(`Le serveur est lancé sur le port ${PORT}`);
});

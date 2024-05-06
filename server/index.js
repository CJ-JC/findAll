const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const env = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const stripe = require("stripe")("sk_test_51Js9DlAyX4TjGLxtmuUeqjjAF2KU4OqeSOnMWdxlcztKt9EGznhefcAu29JddGvjdSUhVHTr3MM6D4dsRkiPZzop003jVRBV7E");
const emailRoutes = require("./routes/emailRoutes");

env.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
env.config();

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 8889,
    database: "finddigital",
});

const port = 8000;

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

// app.post("/create", upload.single("image"), (req, res) => {
//     const { title, description, price } = req.body;
//     const image = req.file.filename;

//     const sql = "INSERT INTO product (`title`, `description`, `price`, `image`) VALUES (?, ?, ?, ?)";
//     const values = [title, description, price, image];

//     db.query(sql, values, (err, result) => {
//         if (err) {
//             return res.json(err);
//         }
//         return res.json({ Status: "Success" });
//     });
// });

app.post("/create", upload.single("image"), (req, res) => {
    const { title, description } = req.body;
    const image = req.file.filename;

    // Insertion du produit dans la base de données
    const productSql = "INSERT INTO product (`title`, `description`, `image`) VALUES (?, ?, ?)";
    const productValues = [title, description, image];

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
    const { title, description } = req.body;
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
        sql = "UPDATE product SET `title` = ?, `description` = ?, `image` = ? WHERE id = ?";
        values = [title, description, image, id];
    } else {
        sql = "UPDATE product SET `title` = ?, `description` = ? WHERE id = ?";
        values = [title, description, id];
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

app.post("/api/create-checkout-session", cors("Access-Control-Allow-Origin", "*"), async (req, res) => {
    const { product, totalPrice } = req.body;
    const id = req.params.id;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: product.title,
                    },
                    unit_amount: Math.round(totalPrice * 100),
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: "http://localhost:3000/success/" + id,
        cancel_url: "http://localhost:3000",
    });
    res.json({ id: session.id });
});

const jwt = require("jsonwebtoken");

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    // Vérifier le token
    jwt.verify(token, "secret_key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Failed to authenticate token" });
        }
        req.email = decoded.email;
        next();
    });
};

// Générer un token JWT lors de la connexion réussie
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    const values = [email, password];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json({ Message: "Error" });
        }

        if (result.length === 0) {
            return res.json({ Message: "Wrong email or password" });
        }

        // Utiliser jwt.sign() pour créer un token avec l'identifiant de l'utilisateur
        const token = jwt.sign({ email: email }, "secret_key");

        // Envoyer le token en réponse
        return res.json({ Message: "Success", token: token });
    });
});

// Endpoint pour la déconnexion
app.post("/logout", (req, res) => {
    res.json({ Message: "Logged out successfully" });
});

app.get("/protected-route", verifyToken, (req, res) => {
    // Si le token est valide, vous pouvez utiliser req.email pour accéder à l'adresse e-mail de l'utilisateur
    res.json({ message: "Access granted", email: req.email });
});

// Endpoint pour la déconnexion
app.post("/logout", (req, res) => {
    res.json({ Message: "Logged out successfully" });
});

app.listen(port, (req, res) => {
    console.log("listening on port " + port);
});

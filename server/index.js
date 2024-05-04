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

    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ Message: "Error" });
        }

        return res.json(result);
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
    const { title, description, price } = req.body;
    const image = req.file.filename;

    const sql = "INSERT INTO product (`title`, `description`, `price`, `image`) VALUES (?, ?, ?, ?)";
    const values = [title, description, price, image];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json(err);
        }
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

app.put("/update/:id", upload.single("image"), (req, res) => {
    const id = req.params.id;
    const { title, description, price } = req.body;

    let image = req.file ? req.file.filename : null;

    let sql;
    let values;
    if (image) {
        sql = "UPDATE product SET `title` = ?, `description` = ?, `price` = ?, `image` = ? WHERE id = ?";
        values = [title, description, price, image, id];
    } else {
        sql = "UPDATE product SET `title` = ?, `description` = ?, `price` = ? WHERE id = ?";
        values = [title, description, price, id];
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json({ Message: "Error" });
        }
        return res.json(result);
    });
});

app.delete("/delete/:id", (req, res) => {
    const sql = "DELETE FROM product WHERE id =?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            res.json(err);
        }
        return res.json(result);
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
                    unit_amount: totalPrice * 100,
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

app.listen(port, (req, res) => {
    console.log("listening on port " + port);
});

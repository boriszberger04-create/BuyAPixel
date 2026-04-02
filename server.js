const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const FILE = "pixels.json";

if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({}));
}

function loadPixels() {
    return JSON.parse(fs.readFileSync(FILE));
}

function savePixels(data) {
    fs.writeFileSync(FILE, JSON.stringify(data));
}

app.get("/pixels", (req, res) => {
    res.json(loadPixels());
});

app.post("/buy", (req, res) => {
    const { x, y, link } = req.body;
    const data = loadPixels();
    const key = `${x},${y}`;

    if (data[key]) {
        return res.status(400).json({ error: "Already taken" });
    }

    data[key] = { link };
    savePixels(data);

    res.json({ success: true });
});

app.listen(3000, () => console.log("Server running"));

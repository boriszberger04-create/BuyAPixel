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
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function savePixels(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.get("/pixels", (req, res) => {
    res.json(loadPixels());
});

app.post("/buy", (req, res) => {
    const { x, y, link, color } = req.body;
    const data = loadPixels();
    const key = `${x},${y}`;

    if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        !link ||
        !color
    ) {
        return res.status(400).json({ error: "Missing data" });
    }

    if (data[key]) {
        return res.status(400).json({ error: "Pixel already taken" });
    }

    data[key] = { link, color };
    savePixels(data);

    res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));

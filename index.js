const express = require("express");
const fs = require("fs");
const env=require("dotenv");
const app = express();
const PORT = 3000;

app.use(express.json());

function readPackages() {
    const data = fs.readFileSync("./packages.json");
    return JSON.parse(data);
}

function writePackages(data) {
    fs.writeFileSync("packages.json", JSON.stringify(data, null, 2));
}

app.get("/packages", (req, res) => {
    const packages = readPackages();
    res.json(packages);
});

app.get("/package/:id", (req, res) => {
    const packages = readPackages();
    const pkg = packages.find(p => p.packageId === req.params.id);

    if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
    }

    res.json(pkg);
});

app.post("/package/:id", (req, res) => {
    const packages = readPackages();

    const newPackage = {
        packageId: req.params.id,
        packageName: req.body.packageName,
        destination: req.body.destination,
        duration: req.body.duration,
        description: req.body.description
    };

    packages.push(newPackage);
    writePackages(packages);

    res.status(201).json({
        message: "Package created successfully",
        package: newPackage
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


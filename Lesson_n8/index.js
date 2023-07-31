const express = require("express");

const serverInstance = express();

serverInstance.use((req, res, next) => {
    if (!req.headers["auth"]) {
        res.status(400).send("Manca l'auth!");
    }
    else {
        let key = req.headers["auth"];
        if (key != "capybara") {
            res.status(401).send("Non sei autenticato!");
            return;
        }
    }
    if (!req.query.name)
        req.query.name = "Orlando";
    next();
});


serverInstance.get("/capybara", (req, response) => {
    let name = req.query.name;
    return response.send(`L'utente ha chiamato il capybara come ${name}`);
})

serverInstance.listen(8080, () => {
    console.log("Sono connesso alla 8080!");
});
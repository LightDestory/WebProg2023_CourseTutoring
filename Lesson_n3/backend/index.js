const express = require('express');
const cors = require('cors');
const app = express();
const secure_key = "capybara"
// Disable cors!
app.use(cors({origin: '*'}));
// Express middleware to parse data properly
app.use(express.json(), express.urlencoded({extended: true}));

// Authroization middleware
app.use((req, res, next) => {
    let secret_key = req.headers['authorization'];
    console.log(secret_key);
    if (!secret_key) return res.status(400).send('No api key provided.');
    if (secret_key != secure_key) return res.status(401).send('Invalid api key provided.');
    next();
});
// Endpoint to load the questions
app.get('/questions', (req, res) => {
    res.status(200).send(`[{"id":"1","title":"Quale è l'unico elemento inline?","answers":[{"id":1,"score":"-10","text":"div"},{"id":2,"score":"10","text":"span"},{"id":3,"score":"-5","text":"p"},{"id":4,"score":"-5","text":"h1"}],"correct":2},{"id":"2","title":"Quale è l'unico elemento block?","answers":[{"id":1,"score":"-10","text":"img"},{"id":2,"score":"-20","text":"span"},{"id":3,"score":"10","text":"form"},{"id":4,"score":"-5","text":"label"}],"correct":3},{"id":"3","title":"Cos'è HTML?","answers":[{"id":1,"score":"-10","text":"Un linguaggio di stile"},{"id":2,"score":"-99","text":"Un linguaggio di programmazione"},{"id":3,"score":"-10","text":"Um Linguaggio di scripting"},{"id":4,"score":"10","text":"Un linguaggio di markup"}],"correct":4},{"id":"4","title":"Cos'è JavaScript?","answers":[{"id":1,"score":"-10","text":"Un linguaggio di markup"},{"id":2,"score":"20","text":"Un linguaggio di programmazione"},{"id":3,"score":"-10","text":"Un Linguaggio di creazione e gestione di database"},{"id":4,"score":"-10","text":"Un linguaggio di stile"}],"correct":2}]`)
});
    
// Start the server
app.listen(3000, () => {
    console.log('App listening on port 3000!');
});

require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use(express.static(path.join(__dirname, './build')));

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
})

// Port superadmin - 3011

app.listen(3011, ()=>{
    console.log(`server running on port 3011`);
});
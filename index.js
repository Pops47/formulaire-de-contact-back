require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Formulaire Server");
});

app.post("/form", (req, res) => {
  const API_KEY = process.env.API_KEY;
  const DOMAIN = process.env.DOMAIN_NAME;
  const MY_MAIL = process.env.MY_MAIL;
  const formData = require("form-data");
  const Mailgun = require("mailgun.js");

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: "Pauline Soubrié",
    key: API_KEY,
  });

  const messageData = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: MY_MAIL,
    subject: req.fields.subject,
    text: req.fields.message,
  };
  client.messages
    .create(DOMAIN, messageData)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.all("*", (req, res) => {
  res.status(404).send("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("Server Started!🚀");
});

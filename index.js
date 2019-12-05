require("dotenv").config();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

const mailgun = require("mailgun-js");
const DOMAIN = "sandboxd0aa85e296194df6bbe7118617c03032.mailgun.org";
const mg = mailgun({
  apiKey: process.env.API_KEY,
  domain: DOMAIN
});

const data = ({ email, ...variables }) => ({
  from:
    "Mailgun Sandbox <postmaster@sandboxd0aa85e296194df6bbe7118617c03032.mailgun.org>",
  to: email,
  subject: "A sweet gift is on the way!",
  template: "gift-wrapping",
  "h:X-Mailgun-Variables": JSON.stringify(variables)
});

const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/:id", (req, res) =>
  res.send({ message: "Hello World!", ...req.params })
);

app.post("/:type", (req, res) => {
  const { type } = req.params;
  console.log(type, req.body && req.body.note_attributes);
  if (type === "order-payment" && req.body && req.body.note_attributes) {
    const config = {};
    req.body.note_attributes.forEach(({ name, value }) => {
      if (name === "date") {
        config.date = (value || "").replace("Shipping ", "");
      }
      if (name === "gift_email") {
        config.email = value;
      }
      if (name === "gift_note") {
        config.gift_note = value;
      }
    });

    if (config.email && config.note) {
      mg.messages().send(data(config), function(error, body) {
        console.log(body);
      });
    }
  }
  return res.send({ message: "Thanks" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

require("dotenv").config();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

// const mailgun = require("mailgun-js");
// const DOMAIN = "sandboxd0aa85e296194df6bbe7118617c03032.mailgun.org";
// const mg = mailgun({
//   apiKey: process.env.API_KEY,
//   domain: DOMAIN
// });

// const data = ({ email, ...variables }) => ({
//   from:
//     "Mailgun Sandbox <postmaster@sandboxd0aa85e296194df6bbe7118617c03032.mailgun.org>",
//   to: email,
//   subject: "A sweet gift is on the way!",
//   template: "gift-wrapping",
//   "h:X-Mailgun-Variables": JSON.stringify(variables)
// });

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const data = (
  { email, ...variables } = {
    gift_from: "From",
    gift_to: "To",
    gift_note: "Gift message from Sweet Nothings",
    date: `${new Date().getMonth() +
      1}/${new Date().getDate()}/${new Date().getFullYear()}`
  }
) => ({
  to: email || "andkha625@gmail.com",
  from: "hello@eatsweetnothings.com",
  subject: "A sweet gift is on the way!",
  templateId: "d-025cac0728104fe78aedaccf7d2e34b7",
  dynamic_template_data: variables
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
      if (name === "gift_from") {
        config.gift_from = value;
      }
      if (name === "gift_to") {
        config.gift_to = value;
      }
    });

    const forLog = ({ id, name, email, total_price } = req.body);
    console.log(forLog, config);

    if (config.email) {
      // mg.messages().send(data(config), function(error, body) {
      //   console.log(body);
      // });
      sgMail
        .send(data(config))
        .then(console.log)
        .catch(console.error);
    }
  }
  return res.send({ message: "Thanks" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

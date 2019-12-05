require("dotenv").config();

const mailgun = require("mailgun-js");
const DOMAIN = "sandboxd0aa85e296194df6bbe7118617c03032.mailgun.org";
const mg = mailgun({
  apiKey: process.env.API_KEY,
  domain: DOMAIN
});

const data = (variables = { gift_note: "Happy Birthday!" }) => ({
  from:
    "Mailgun Sandbox <postmaster@sandboxd0aa85e296194df6bbe7118617c03032.mailgun.org>",
  to: "andkha625@gmail.com",
  subject: "A sweet gift is on the way!",
  template: "gift-wrapping",
  "h:X-Mailgun-Variables": JSON.stringify(variables)
});

const express = require("express");
const app = express();
const port = 3000;

app.get("/:id", (req, res) =>
  res.send({ message: "Hello World!", ...req.params })
);

app.post("/:type", (req, res) => {
  const { type } = req.params;
  console.log(type, req.body);
  // mg.messages().send(data(), function(error, body) {
  //   console.log(body);
  // });
  return res.send({ message: "Thanks", ...req.params });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

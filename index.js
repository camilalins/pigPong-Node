require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    rolling: true, //session renew in each request
    cookie: { maxAge: process.env.SESSION_TIMEOUT*1000*60 }
  }));

app.use("/public", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.set('views', __dirname + "/public/views")

const indexRoute = require("./public/routes/index.route")
const loginRoute = require("./public/routes/login.route")
const logoutRoute = require("./public/routes/logout.route")
const homeRoute = require("./public/routes/home.route")
const orderRoute = require("./public/routes/order.route")
const eventsRoute = require("./public/routes/events.route")
const guestsRoute = require("./public/routes/guests.route")

// ROUTES
app.all(["/*"], (req, res, next) => {

    if(!req.session.cart)
        req.session.cart = [];

    if(!req.session.user)
        req.session.user = null;

    req.session.groupedCart =  req.session.cart.reduce((agg, item) => {
        agg[item] += 50;
        return agg;
    }, { "QR": 0, "RSVP": 0, "STD": 0 });

    res.locals = req.session;

    next();
});
app.use("/", indexRoute);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/home", homeRoute);
app.use("/order", orderRoute);
app.use("/events", eventsRoute);
app.use("/guests", guestsRoute);

app.listen(3001);
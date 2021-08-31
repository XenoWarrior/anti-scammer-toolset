// Modules
const path = require("path");
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require('cors');

// DotEnv
require('dotenv').config();

// Middleware
const Pixel = require("./server/routes/PixelTracker");
const Redirect = require("./server/routes/RedirectLink");

// App Initialisation
const app = express();
const router = express.Router();
const port = process.env.PORT || 3030;

// Static
app.use(express.static(path.join(__dirname, "dist")));

// Modules
app.use(cors());
app.use(busboy());

// Auth/Sessions
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Custom Routes
// TODO: Dynamically register
app.use(`${process.env.API_V1}/pixel`, new Pixel().GetRoutes());
app.use(`${process.env.API_V1}/redirect`, new Redirect().GetRoutes());

// Start App
(async function () {
    app.use(router);
    app.listen(port, function () {
        console.log(`Server is listening for connection on ${process.env.API_V1}.`);
        app.get("/", (req, res) => {
            res.send("Hello, world!");
        });
    });
})();
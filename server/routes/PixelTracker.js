const fs = require('fs-extra');
const parser = require('ua-parser-js');
const btoa = require("btoa");

const RouteBase = require("./RouteBase");
const DatabaseManager = require("../lib/database-manager");

const constants = require("../lib/constants");

const database = new DatabaseManager(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);
const { v4: uuid } = require("uuid");
const level = process.env.LOG_LEVEL;

class Pixel extends RouteBase {

    constructor() {
        super();

        level >= constants.LOG_LEVEL.DEBUG ? console.log(`[DEBUG] ${this.constructor.name}: Initialised`) : null;
        level >= constants.LOG_LEVEL.TRACE ? console.trace("[TRACE]") : null;
    }

    /**
     * Generate Pixel
     * @param {object} req | Incoming request data
     * @param {object} res | Handle responses
     */
    async generatePixel(req, res) {
        let requestId = uuid();
        console.log(req);

        let pixel = "./images/pixel.png"
        let stats = fs.statSync(pixel);
        let file = fs.createReadStream(pixel);

        file.on("error", function (e) {
            res.status(404).send({
                status: 404,
                message: "File does not exist",
                error: e,
                request: requestId
            });
        });

        file.on("open", function () {
            let headers = {
                "Connection": "keep-alive",
                "Content-Length": stats.size,
                "Accept-Ranges": "bytes",
                "Content-Type": `image/png`,
                "Content-Disposition": `filename="${requestId}.png"`
            };

            res.status(200).set(headers);
            file.pipe(res);
        });

        // We'll just insert all the raw details for now, then find a nicer way to split it out, either on the server or client
        let deviceDetails = parser(req.headers['user-agent']);
        database.insert("pixel_tracker", {
            pixel_identifier: btoa(req.params.id),
            pixel_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            pixel_raw_user_agent: req.headers["user-agent"],
            pixel_parsed_user_agent: JSON.stringify(deviceDetails),
            pixel_raw_headers: JSON.stringify(req.headers),
            pixel_request_date: Date.now(),
            request_id: requestId
        }).catch((e) => {
            console.error("[ERROR] Unable to insert record:", e);
        });
    }

    /**
     * Get Routes
     * Returns a set of routes for use in the front-end application.
     * @returns {function} the routes for this controller
     */
    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.all("/:id", this.generatePixel);

            return router;
        })();
    }
}

module.exports = Pixel;
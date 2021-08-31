const fs = require('fs-extra');
const parser = require('ua-parser-js');
const validUrl = require('valid-url');
const btoa = require("btoa");

const RouteBase = require("./RouteBase");
const DatabaseManager = require("../lib/database-manager");

const constants = require("../lib/constants");

const database = new DatabaseManager(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);
const { v4: uuid } = require("uuid");
const level = process.env.LOG_LEVEL;

class Redirect extends RouteBase {

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
    async redirect(req, res) {
        let requestId = uuid();

        if(validUrl.isUri(req.params.url)) {
            res.redirect(req.params.url);
        } else {
            res.redirect("https://www.google.com/");
            req.params.url = `Invalid URI: ${btoa(req.params.url)}`;
        }

        // We'll just insert all the raw details for now, then find a nicer way to split it out, either on the server or client
        let deviceDetails = parser(req.headers['user-agent']);
        database.insert("redirect_tracker", {
            redirect_identifier: btoa(req.params.id),
            redirect_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            redirect_raw_user_agent: req.headers["user-agent"],
            redirect_parsed_user_agent: JSON.stringify(deviceDetails),
            redirect_raw_headers: JSON.stringify(req.headers),
            redirect_request_date: Date.now(),
            redirect_url: req.params.url,
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

            router.all("/:id/:url(*)", this.redirect);

            return router;
        })();
    }
}

module.exports = Redirect;
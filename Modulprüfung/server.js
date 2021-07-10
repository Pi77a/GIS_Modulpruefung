"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modulprüfung = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var Modulprüfung;
(function (Modulprüfung) {
    let orders;
    let port = Number(process.env.PORT);
    if (!port) {
        port = 8100;
    }
    // let databaseUrl: string = "mongodb://localhost:27017";
    let databaseUrl = "mongodb+srv://TestUser:Pi77a@gis21.8g1ja.mongodb.net/Modulprüfung?retryWrites=true&w=majority";
    startServer(port);
    connectToDatabase(databaseUrl);
    function startServer(_port) {
        let server = Http.createServer();
        server.listen(_port);
        server.addListener("request", handleRequest);
    }
    async function connectToDatabase(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        orders = mongoClient.db("Modulprüfung").collection("Imagelinks");
    }
    async function handleRequest(_request, _response) {
        console.log("HEY");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "application/json; charset=utf-8");
        let url = Url.parse(_request.url, true);
        console.log(url);
        if (url.pathname == "/send") {
            orders.insertOne(url.query);
        }
        else if (url.pathname == "/get") {
            let entry = JSON.stringify(await orders.findOne({ num: url.search }));
            _response.write(entry);
        }
        _response.end();
    }
    /*function retrieveEntries(): void {
        let entries: string[] = orders.find().toArray();
        for (let key in entries) {
            let htmlanswer: string = "";
            htmlanswer = "<div>" + key + ": " + entries[key] + "</div>";
            _response.write(htmlanswer);
        }
    }*/
})(Modulprüfung = exports.Modulprüfung || (exports.Modulprüfung = {}));
//# sourceMappingURL=server.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modulprüfung = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var Modulprüfung;
(function (Modulprüfung) {
    let images;
    let scores;
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
        images = mongoClient.db("Modulprüfung").collection("Imagelinks");
        scores = mongoClient.db("Modulprüfung").collection("Scoreboard");
    }
    async function handleRequest(_request, _response) {
        console.log("HEY");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/json; charset=utf-8");
        let url = Url.parse(_request.url, true);
        console.log(url);
        if (url.pathname == "/get") {
            let entry = JSON.stringify(await images.findOne({ num: url.search }));
            _response.write(entry);
        }
        else if (url.pathname == "/send") {
            scores.insertOne(url.query);
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            (async () => {
                await delay(3500);
            })();
            scores.aggregate([
                { $sort: { time: 1 } }
            ]);
            let studenten = await getEntryDb();
            _response.write(JSON.stringify(studenten));
        }
        _response.end();
        async function getEntryDb(searchRegistration) {
            let cursor = null;
            if (searchRegistration) {
                cursor = scores.find({ registration: Number(searchRegistration) });
            }
            else {
                cursor = scores.find();
            }
            let result = await cursor.toArray();
            result.sort();
            return result;
        }
    }
})(Modulprüfung = exports.Modulprüfung || (exports.Modulprüfung = {}));
//# sourceMappingURL=server.js.map
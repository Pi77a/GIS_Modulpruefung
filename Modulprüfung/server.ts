import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

export namespace Modulprüfung {
    let orders: Mongo.Collection;

    let port: number = Number(process.env.PORT);
    if (!port) {
        port = 8100;
    }
    // let databaseUrl: string = "mongodb://localhost:27017";
    let databaseUrl: string = "mongodb+srv://TestUser:Pi77a@gis21.8g1ja.mongodb.net/Modulprüfung?retryWrites=true&w=majority";

    startServer(port);
    connectToDatabase(databaseUrl);

    function startServer(_port: number): void {
        let server: Http.Server = Http.createServer();
        server.listen(_port);
        server.addListener("request", handleRequest);
    }

    async function connectToDatabase(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        orders = mongoClient.db("Modulprüfung").collection("Imagelinks");
    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        console.log("HEY");

        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "application/json; charset=utf-8");

        let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
        console.log(url);


        if (url.pathname == "/send") {
            orders.insertOne(url.query);
        } else if (url.pathname == "/get") {
            let entry: string = JSON.stringify(await orders.findOne({ num: url.search }));
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
}

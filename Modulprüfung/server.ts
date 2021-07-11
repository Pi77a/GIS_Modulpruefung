import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

export namespace Modulprüfung {
    let images: Mongo.Collection;
    let scores: Mongo.Collection;

    interface Score2 {
        id: string;
        username: string;
        time: string;
    }



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
        images = mongoClient.db("Modulprüfung").collection("Imagelinks");
        scores = mongoClient.db("Modulprüfung").collection("Scoreboard");


    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        console.log("HEY");

        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/json; charset=utf-8");

        let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
        console.log(url);


        if (url.pathname == "/get") {
            let entry: string = JSON.stringify(await images.findOne({ num: url.search }));
            _response.write(entry);
        } else if (url.pathname == "/send") {

            scores.insertOne(url.query);
            
            function delay(ms: number): Promise<void> {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            (async () => {

                await delay(3500);
            })();
            scores.aggregate(
                [
                    { $sort: { time: 1} }
                ]
            );

            let studenten: Score2[] = await getEntryDb();

            _response.write(JSON.stringify(studenten));


        }
        _response.end();

        async function getEntryDb(searchRegistration?: string): Promise<Score2[]> {
            let cursor: Mongo.Cursor = null;
            

            if (searchRegistration) {
                cursor = scores.find({ registration: Number(searchRegistration) });
            } else {
                cursor = scores.find();
            }

            let result: Score2[] = await cursor.toArray();
            result.sort();
            return result;
        }
    }
}

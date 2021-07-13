namespace Modulprüfung {
    console.log(document.location.pathname);
    interface Score2 {
        id: string;
        username: string;
        time: string;
    }

    if (window.location.pathname== "./Spieloberflaeche.html") {
        interface Image {
            id: string;
            imageURL: string;
            num: string;
        }


        let randNum: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

        let vergleich: string[] = [];
        let unsichtbar: string[] = [];
        let unsichtbar2: string[] = [];
        let counter: number = 0;

        for (let i: number = 1; i < 19; i++) {
            serverrequestget();

            async function serverrequestget(): Promise<void> {
                if (document.body.style.width < "400px") {
                    let aside: HTMLElement = document.getElementById("aside");
                    aside.style.opacity = "0%";
                }
                let l: number = randNum.splice(Math.floor(Math.random() * randNum.length), 1);
                console.log(l);

                //let url: string = "http://localhost:8100/get?" + l;
                let url: string = "https://grundlageninteraktivesysteme.herokuapp.com/get?" + l;
                let _response: Response = await fetch(url);

                let consoleRespond: Image = await _response.json();
                console.log(consoleRespond.imageURL);

                let div: HTMLDivElement = document.createElement("div");
                div.classList.add("item");
                div.addEventListener("click", flipCard);
                div.id = "item" + l.toString();
                document.getElementById("Bigwrapper").appendChild(div);

                let img1: HTMLImageElement = document.createElement("img");
                img1.src = "data/memory.png";
                img1.classList.add("img1");
                img1.id = "pic1" + l.toString();
                div.appendChild(img1);

                let img2: HTMLImageElement = document.createElement("img");
                img2.src = consoleRespond.imageURL;
                img2.classList.add("img2");
                img2.id = "pic2" + l.toString();
                div.appendChild(img2);

                function flipCard(_e: Event): void {
                    vergleich.push(img2.src);
                    unsichtbar.push(img1.id);
                    unsichtbar.push(img2.id);
                    unsichtbar2.push(div.id);

                    img1.style.opacity = "0%";
                    img2.style.opacity = "100%";

                    function delay(ms: number): Promise<void> {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }


                    if (vergleich[0] != null && vergleich[1] != null) {
                        document.body.style.pointerEvents = "none";
                        (async () => {

                            await delay(1500);
                            document.body.style.pointerEvents = "auto";
                            rightWrong();
                        })();
                    } else if (vergleich[1] == null) {
                        img1.style.opacity = "0%";
                        img2.style.opacity = "100%";
                    }

                    function rightWrong(): void {
                        if (vergleich[0] == vergleich[1]) {

                            document.getElementById(unsichtbar2[0]).removeChild(document.getElementById(unsichtbar[0]));
                            document.getElementById(unsichtbar2[0]).removeChild(document.getElementById(unsichtbar[1]));
                            document.getElementById(unsichtbar2[1]).removeChild(document.getElementById(unsichtbar[2]));
                            document.getElementById(unsichtbar2[1]).removeChild(document.getElementById(unsichtbar[3]));

                            document.getElementById(unsichtbar2[0]).style.pointerEvents = "none";
                            document.getElementById(unsichtbar2[1]).style.pointerEvents = "none";

                            let div2: HTMLDivElement = document.createElement("div");
                            document.getElementById("ablage").appendChild(div2);

                            let imgablage1: HTMLImageElement = document.createElement("img");
                            imgablage1.src = vergleich[0];
                            imgablage1.classList.add("imgablage1");
                            div2.appendChild(imgablage1);

                            let div3: HTMLDivElement = document.createElement("div");
                            document.getElementById("ablage").appendChild(div3);

                            let imgablage2: HTMLImageElement = document.createElement("img");
                            imgablage2.src = vergleich[1];
                            imgablage2.classList.add("imgablage1");
                            div3.appendChild(imgablage2);
                            vergleich = [];
                            unsichtbar = [];
                            unsichtbar2 = [];
                            counter++;
                        }
                        else if (vergleich[0] != vergleich[1]) {
                            document.getElementById(unsichtbar[0]).style.opacity = "100%";
                            document.getElementById(unsichtbar[1]).style.opacity = "0%";
                            document.getElementById(unsichtbar[2]).style.opacity = "100%";
                            document.getElementById(unsichtbar[3]).style.opacity = "0%";
                            vergleich = [];
                            unsichtbar = [];
                            unsichtbar2 = [];
                        }
                    }
                }
            }
        }

        //Nachvolgender Code von https://www.w3schools.com/howto/howto_js_countdown.asp genommen und für eine Stopwatch umgeändert.
        let start: number = new Date().getTime();

        // Update the count down every 1 second
        let x: NodeJS.Timer = setInterval(function (): void {

            // Get today's date and time
            let now: number = new Date().getTime();

            // Find the distance between now and the count down date
            let distance: number = now - start;

            // Time calculations for days, hours, minutes and seconds
            let minutes: number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds: number = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="time"
            if (minutes < 10) {
                document.getElementById("time").innerHTML = "0" + minutes + ":" + seconds /*+ "." +mseconds*/;
                if (seconds < 10) {
                    document.getElementById("time").innerHTML = "0" + minutes + ":0" + seconds /*+ "." +mseconds*/;
                }
            } else if (minutes > 10) {
                document.getElementById("time").innerHTML = minutes + ":" + seconds /*+ "." +mseconds*/;
                if (seconds < 10) {
                    document.getElementById("time").innerHTML = minutes + ":0" + seconds /*+ "." +mseconds*/;
                }
            }

            // If the count down is finished, write some text
            if (counter == 9) {
                clearInterval(x);
                localStorage.setItem("time", document.getElementById("time").innerHTML);
                window.location.assign("./Glueckwunsch.html");
            }
        },                                1000);
    } else if (window.location.pathname== "./Glueckwunsch.html") {


        let button: HTMLButtonElement = document.getElementById("score");
        button.addEventListener("click", scoreboard);

        function scoreboard(_clickEvent: Event): void {
            let formData: FormData = new FormData(document.forms[0]);
            let username: string = formData.get("username");
            localStorage.setItem("username", username);
            window.location.assign("./Scoreboardseite.html");
        }
    }
    else if (pathname == "./Scoreboardseite.html") {

        if (localStorage.getItem("username") != null && localStorage.getItem("time") != null) {
            serverrequestsend();
        }
        else {
            serverrequestsend2();
        }


        async function serverrequestsend(): Promise<void> {

            let scorearray: string[] = [localStorage.getItem("time"), localStorage.getItem("username")];
            let url: string = "https://grundlageninteraktivesysteme.herokuapp.com/send?" + "time=" + scorearray[0] + "&username=" + scorearray[1];
            //let url: string = "http://localhost:8100/send?" + "time=" + scorearray[0] + "&username=" + scorearray[1];
            console.log(url);

            


            updateList(url);
        }
        async function serverrequestsend2(): Promise<void> {
            let scorearray: string[] = [localStorage.getItem("time"), localStorage.getItem("username")];
            let url: string = "https://grundlageninteraktivesysteme.herokuapp.com/send?" + "time=" + scorearray[0] + "&username=" + scorearray[1];
            //let url: string = "http://localhost:8100/send?" + "time=" + scorearray[0] + "&username=" + scorearray[1];
            updateList(url);
        }

        async function updateList(_url: RequestInfo): Promise<void> {
            let resp: Response = await fetch(_url);
            let scoreListe: HTMLDivElement = <HTMLDivElement>document.getElementById("second");

            let olS: HTMLOListElement = document.createElement("ol");
            olS.className = "score";
            let antwort: Score2[] = await resp.json();
            

            scoreListe.innerHTML = "";

            for (let student1 of antwort) {
                
                let user: HTMLLIElement = document.createElement("li");
                user.innerText = student1.username + ": " + student1.time;
                olS.appendChild(user);

            }

            scoreListe.appendChild(olS);
        }
        let again: HTMLButtonElement = <HTMLButtonElement>document.getElementById("again");
        again.addEventListener("click", playAgain);

        function playAgain(_clickEvent: Event): void {
            window.location.assign("./Spieloberflaeche.html");
        }
    }
    
}

"use strict";
var Modulprüfung;
(function (Modulprüfung) {
    let vergleich = [];
    let unsichtbar = [];
    let unsichtbar2 = [];
    for (let i = 1; i < 19; i++) {
        serverrequestget();
        async function serverrequestget() {
            //let url: string = "http://localhost:8100/get?" + i;
            let url = "https://grundlageninteraktivesysteme.herokuapp.com/get?" + i;
            let _response = await fetch(url);
            var consoleRespond = await _response.json();
            console.log(consoleRespond.imageURL);
            let div = document.createElement("div");
            div.classList.add("item");
            div.addEventListener("click", flipCard);
            document.getElementById("Bigwrapper").appendChild(div);
            let img1 = document.createElement("img");
            img1.src = "data/memory.png";
            img1.classList.add("img1");
            img1.id = img1.src;
            div.appendChild(img1);
            let img2 = document.createElement("img");
            img2.src = consoleRespond.imageURL;
            img2.classList.add("img2");
            div.appendChild(img2);
            function flipCard(_e) {
                vergleich.push(img2.src);
                unsichtbar.push(img1);
                unsichtbar.push(img2);
                unsichtbar2.push(div);
                img1.style.opacity = "0%";
                img2.style.opacity = "100%";
                function delay(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }
                (async () => {
                    await delay(2500);
                    rightWrong();
                })();
                function rightWrong() {
                    if (vergleich[0] == vergleich[1]) {
                        unsichtbar2[0].style.pointerEvents = "none";
                        unsichtbar2[1].style.pointerEvents = "none";
                        unsichtbar[0].style.opacity = "0%";
                        unsichtbar[1].style.opacity = "0%";
                        unsichtbar[2].style.opacity = "0%";
                        unsichtbar[3].style.opacity = "0%";
                        let div2 = document.createElement("div");
                        document.getElementById("ablage").appendChild(div2);
                        let imgablage1 = document.createElement("img");
                        imgablage1.src = vergleich[0];
                        imgablage1.classList.add("imgablage1");
                        div2.appendChild(imgablage1);
                        let imgablage2 = document.createElement("img");
                        imgablage2.src = vergleich[1];
                        imgablage2.classList.add("imgablage1");
                        div2.appendChild(imgablage2);
                        vergleich = [];
                        unsichtbar = [];
                        unsichtbar2 = [];
                    }
                    else if (vergleich[1] == null) {
                        img1.style.opacity = "0%";
                        img2.style.opacity = "100%";
                    }
                    else if (vergleich[0] != vergleich[1]) {
                        unsichtbar[0].style.opacity = "100%";
                        unsichtbar[1].style.opacity = "0%";
                        unsichtbar[2].style.opacity = "100%";
                        unsichtbar[3].style.opacity = "0%";
                        vergleich = [];
                        unsichtbar = [];
                        unsichtbar2 = [];
                    }
                }
            }
        }
    }
})(Modulprüfung || (Modulprüfung = {}));
//# sourceMappingURL=client.js.map
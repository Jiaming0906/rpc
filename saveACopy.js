const clientId = '1151792418253971517';
const DiscordRPC = require('discord-rpc');
const cheerio = require('cheerio');
const axios = require('axios');

const RPC = new DiscordRPC.Client({ transport: 'ipc' });
const { Client, IntentsBitField, ActivityType } = require("discord.js");

const client = new Client( {
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
    ],
});

DiscordRPC.register(clientId);
console.log(`clientId: ${clientId}`);

//weather 
const weather = ["x"];
const tempMaxMin = ["x", "x"];

//download website 
async function performScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "http://www.weather.gov.sg/home",
        headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    // parsing the HTML source of the target web page with Cheerio
    const $ = cheerio.load(axiosResponse.data);

    const htmlElement = $(".w-sky");
    const $w = htmlElement.find("p");

    const temp = $(".w-tem");
    const $temp = temp.find("h2");
    const temp2 = $temp.text().split("C");
    temp2.pop();

    weather.pop();
    tempMaxMin.pop();
    tempMaxMin.pop();
    
    weather.push($w.text());
    tempMaxMin.push(temp2[0]);
    tempMaxMin.push(temp2[1]);

    // console.log(`w: ${weather}`);
    // console.log(`t: ${tempMaxMin}`);
};

performScraping();

//0:playing, 1:streaming, 2:listening, 3:watching, 4:{emoji}{state}, 5:competing

async function setActivity() {
    if(!RPC) return;

    performScraping();

    let currentTime = new Date();
    var minutes = String(currentTime.getMinutes()).padStart(2, "0");
    var hours = String(currentTime.getHours()).padStart(2, "0");
    var year = currentTime.getFullYear();
    var month = String(currentTime.getMonth()+1).padStart(2, "0");
    var day = String(currentTime.getDate()).padStart(2, "0");

    //changing words
    const emoji = "😀😁😂🤣😃😄😎😋😊😉😆😅😍😘🥰😗😙🥲🤔🤩🤗🙂😚🫡🤨😑😐😶🫥😮😏🙄😪🤪🥶😱🤬😡😠😵‍💫🥺🥹🤭🤫🫢🫣🧐";
    const words = ["😀","😁","😂","🤣","😃","😄","😎","😋","😊","😉","😆","😅","😍","😘","🥰","😗","😙","🥲","🤔","🤩","🤗","🙂","😚","🫡","🤨","😑","😐","😶","🫥","😮","😏","🙄","😪","🤪","🥶","😱","🤬","😡","😠","😵‍💫","🥺","🥹","🤭","🤫","🫢","🫣","🧐"];
    var random = Math.floor(Math.random() * words.length);



    RPC.setActivity( {
        //details: `V4647 Sagittarii`,
        details: `${weather.slice(-1)}, ${tempMaxMin[tempMaxMin.length - 1]}C - ${tempMaxMin[tempMaxMin.length - 2]}C`,
        state: `my time: ${day}/${month}/${year}, ${hours}${minutes} (GMT+0800)`,
        //state: `The brightess star in our galaxy.`
        //startTimestamp: Date.now(),
        //largeImageKey: `${photos[pRandom]}`,
        //largeImageText: `drink me`,
        // smallImageKey: 'img_1511',
        // smallImageText: `small icon`,
        instance: false
        // buttons: [
        //     {
        //         label: `ML`,
        //         url: `https://mml-book.github.io/book/mml-book.pdf`
        //     },
        //     {
        //         label: `Stats`,
        //         url: `https://www.statlearning.com/`
        //     }
        // ]
    });
};

RPC.on('ready', async () => {
    setActivity();

    setInterval(() => {
        setActivity();
    }, 10 * 1000);
});

// RPC.on('ready', async () => {
//     setActivity();

//     setInterval(() => {
//         setActivity();
//     }, 15 * 1000);
// });

RPC.login({ clientId: clientId }). catch(err => console.log(err));

// client.on("ready", (c) => {
//     console.log(`${c.user.tag} has logged on`);

//     client.user.setActivity({
//         name: `Babe`,
//         type: ActivityType.Watching,
//     });
// });


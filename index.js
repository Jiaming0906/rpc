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

const current = new Date();

DiscordRPC.register(clientId);
console.log(`${current}`);

//weather 
const weather = ["-", "-"];
const tempMaxMin = ["-", "-"];

//download website 
async function performScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.google.com/search?q=weather&oq=weather&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GJ0CGIoFMg4IABBFGCcYOxidAhiKBTIGCAEQRRhAMg8IAhAAGEMYgwEYsQMYigUyEggDEAAYQxiDARixAxjJAxiKBTIGCAQQRRg8MgYIBRBFGDwyBggGEEUYPDIGCAcQRRg80gEIMTE3OWoxajSoAgCwAgA&sourceid=chrome&ie=UTF-8",
        headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    // parsing the HTML source of the target web page with Cheerio
    const $ = cheerio.load(axiosResponse.data);

    const htmlElement = $(".UQt4rd");
    const $w = htmlElement.children("img").attr("alt");

    const temp = $(".vk_bk.TylWce.SGNhVe");
    const $temp = temp.children(".wob_t.q8U8x");

    weather.pop();
    tempMaxMin.pop();
    
    weather.push(String($w).toLowerCase());
    tempMaxMin.push($temp.text())

    // console.log(`w: ${weather}`);
    // console.log(`t: ${tempMaxMin}`);
};

performScraping().catch((err) => {
    console.log(err);
});

//word
// const wotd = ["x"];

// //download website 
// async function wordScraping() {
//     // downloading the target web page
//     // by performing an HTTP GET request in Axios
//     const axiosResponse = await axios.request({
//         method: "GET",
//         url: "https://www.dictionary.com/e/word-of-the-day/",
//         headers: {
//     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
//         }
//     })

//     // parsing the HTML source of the target web page with Cheerio
//     const $ = cheerio.load(axiosResponse.data);

//     const htmlElement = $(".otd-items.wotd-items");
//     const $w = htmlElement.children(".otd-item-wrapper").attr("data-name");
//     const wordOnly = String($w).split("-")[0]

//     wotd.pop();
    
//     wotd.push(wordOnly);

//     //console.log(`${wotd}`)

// };

//wordScraping();


//0:playing, 1:streaming, 2:listening, 3:watching, 4:{emoji}{state}, 5:competing

async function setActivity() {
    if(!RPC) return;

    performScraping().catch((err) => {
        console.log(err);
    });
    //wordScraping();

    let currentTime = new Date();
    var minutes = String(currentTime.getMinutes()).padStart(2, "0");
    var hours = String(currentTime.getHours()).padStart(2, "0");
    var year = currentTime.getFullYear();
    var month = String(currentTime.getMonth()+1).padStart(2, "0");
    var day = String(currentTime.getDate()).padStart(2, "0");

    //changing words
    const words = ["😀","😁","😂","🤣","😃","😄","😎","😋","😊","😉","😆","😅","😍","😘","🥰","😗","😙","🥲","🤔","🤩","🤗","🙂","😚","🫡","🤨","😑","😐","😶","🫥","😮","😏","🙄","😪","🤪","🥶","😱","🤬","😡","😠","😵‍💫","🥺","🥹","🤭","🤫","🫢","🫣","🧐"];
    var random = Math.floor(Math.random() * words.length);

    RPC.setActivity( {
        //details: `V4647 Sagittarii`,
        details: `it is ${weather.slice(-1)}, ${tempMaxMin[tempMaxMin.length - 1]}℃ here`,
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
        //         label: `wotd: ${wotd[wotd.length - 1]}`,
        //         url: `https://www.dictionary.com/e/word-of-the-day/`
        //     },
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
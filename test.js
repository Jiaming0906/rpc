const cheerio = require('cheerio');
const axios = require('axios');

const wotd = [];

//download website 
async function wordScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.haze.gov.sg/",
        headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    // parsing the HTML source of the target web page with Cheerio
    const $ = cheerio.load(axiosResponse.data);

    const htmlElement = $(".col-xs-12.col-sm-6.col-md-5.offset-md-1");
    //const $w = htmlElement.children(".panel-stats-value").attr("style");
    const $w = htmlElement.find("h3").text();


    //const temp = $(".vk_bk.TylWce.SGNhVe");
    //const $temp = temp.children(".wob_t.q8U8x");
    
    wotd.push($w);
    //tempMaxMin.push($temp.text())

    console.log(`${$w}`)
    //console.log(`${tempMaxMin}`)

};

wordScraping();

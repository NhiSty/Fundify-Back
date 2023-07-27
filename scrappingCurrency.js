const puppeteer = require('puppeteer');
const fs = require('fs');
const cheerio = require('cheerio');

const urlToScrap = 'https://fr.tradingview.com/markets/currencies/cross-rates-overview-prices/';

async function getHtmlPage() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const websitePage = await browser.newPage();
    await websitePage.goto(urlToScrap, {
      waitUntil: 'domcontentloaded',
    });

    await websitePage.waitForSelector('table tbody tr th span');
    await websitePage.waitForTimeout(1000);

    const htmlPage = await websitePage.content();
    await browser.close();

    return htmlPage;
  } catch (error) {
    throw new Error(`Error : Cannot fetch data from website : ${error.message}`);
  }
}

function extractInfos(html) {
  const currencyData = {};

  const $ = cheerio.load(html);

  const rowsTr = $('tr');

  const headerRow = $(rowsTr[0]);
  const currencies = headerRow
    .find('th span')
    .toArray()
    .map((element) => $(element).text().trim());

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < rowsTr.length; i++) {
    const row = $(rowsTr[i]);
    const columns = row.find('td');

    const currencyBeforeSlash = currencies[i - 1];

    // eslint-disable-next-line no-plusplus
    for (let j = 1; j < columns.length; j++) {
      const value = parseFloat($(columns[j - 1]).find('span').text());

      const currencyAfterSlash = currencies[j - 1];

      if (currencyBeforeSlash !== currencyAfterSlash) {
        const currencyPair = `${currencyBeforeSlash}/${currencyAfterSlash}`;
        currencyData[currencyPair] = value;
      }
    }
  }
  return currencyData;
}

function saveDataToFileJson(data) {
  const fileName = 'currency_data.json';
  fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(`Error : Cannot save data on file : ${err.message}`);
    } else {
      console.log(`Currency has set correctly in ${fileName}`);
    }
  });
}
async function mainProcess() {
  try {
    const htmlPage = await getHtmlPage();
    const extractedInfos = extractInfos(htmlPage);
    saveDataToFileJson(extractedInfos);
  } catch (error) {
    console.error(error.message);
  }
}

mainProcess();

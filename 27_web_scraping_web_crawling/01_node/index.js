import fs from 'fs';

/*
const response = await fetch("https://www.proshop.dk/baerbar");
const html = await response.text();
fs.writeFileSync('index.html', html);
*/

import { load } from 'cheerio';
import { console } from 'inspector';

const page = await fs.readFileSync('index.html', 'utf-8');
const $ = load(page);

$("#products [product]").each((index,element) => {
    const name = $(element).find(".site-product-link").text();
    const price = $(element).find(".site-currency-lg").text();

    console.log(price, name.trim());
});
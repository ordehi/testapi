const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const sites = require('./sites');

const app = express();

const myZone = -4;
let jobOn = false;
const trimSplit = (input) => input.trim().split('UTC')[1];

sites.forEach((site) => {
  axios
    .get(site.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("Technical Advocate")', html).each(function () {
        const position = cheerio.load($(this).html());
        if (position('strong').text().includes(myZone.toString())) {
          jobOn = true;
        }

        const zones = position('strong').text().split('➔');
        jobOn = trimSplit(zones[0]) <= myZone || trimSplit(zones[1]) >= myZone;
      });
    })
    .catch((err) => console.log(err));
});

app.get('/', (req, res) => {
  res.send(jobOn);
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

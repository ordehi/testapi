const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newspapers = [
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: 'https://www.thetimes.co.uk',
  },
  {
    name: 'theguardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: 'https://www.theguardian.com',
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk',
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');
        articles.push({
          title,
          url: url.indexOf(newspaper.base) != -1 ? url : newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/', (req, res) => {
  res.json('Welcome to my test API');
});

app.get('/news', (req, res) => {
  res.json(articles);
});

app.get('/news/:newspaperId', async (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');
        specificArticles.push({
          title,
          url: url.indexOf(newspaperBase) != -1 ? url : newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

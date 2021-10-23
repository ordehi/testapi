const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newspapers = [
  {
    name: 'cityam',
    address:
      'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
    base: 'https://www.cityam.com',
  },
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
  {
    name: 'nyt',
    address: 'https://www.nytimes.com/international/section/climate',
    base: 'https://www.nytimes.com',
  },
  {
    name: 'latimes',
    address: 'https://www.latimes.com/environment',
    base: 'https://www.latimes.com',
  },
  {
    name: 'smh',
    address: 'https://www.smh.com.au/environment/climate-change',
    base: 'https://www.smh.com.au',
  },
  {
    name: 'un',
    address: 'https://www.un.org/climatechange',
    base: 'https://www.un.org',
  },
  {
    name: 'bbc',
    address: 'https://www.bbc.co.uk/news/science_and_environment',
    base: 'https://www.bbc.co.uk',
  },
  {
    name: 'es',
    address: 'https://www.standard.co.uk/topic/climate-change',
    base: 'https://www.standard.co.uk',
  },
  {
    name: 'sun',
    address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
    base: 'https://www.thesun.co.uk',
  },
  {
    name: 'dm',
    address:
      'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
    base: 'https://www.dailymail.co.uk',
  },
  {
    name: 'nyp',
    address: 'https://nypost.com/tag/climate-change/',
    base: 'https://nypost.com',
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

app.get('/news/:newspaperId', (req, res) => {
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

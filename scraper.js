const cheerio = require("cheerio");
const axios = require("axios");

const siteUrl = "https://davesgarden.com/guides/pf/go/55346/";

let siteName = "";
const categories = new Set();
const tags = new Set();
const locations = new Set();
const positions = new Set();

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getResults = async () => {
  const $ = await fetchData();

  siteName = $('.site-container > .row > .main > .plants-files').text();

  $(".site-container > .row > .main > .plants-files > .plantfiles-gallery > .plantfiles-gallery-image > a > img").each((index, element) => {
    tags.add($(element).text());
  });
  $(".location").each((index, element) => {
    locations.add($(element).text());
  });
  $("div.nav p").each((index, element) => {
    categories.add($(element).text());
  });
  $('.company_and_position [itemprop="title"]').each((index, element) => {
    positions.add($(element).text());
  });
  return {
    positions: [...positions].sort(),
    tags: [...tags].sort(),
    locations: [...locations].sort(),
    categories: [...categories].sort(),
    siteName,
  };
};

module.exports = getResults;

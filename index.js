const Nightmare = require('nightmare');
const nm = Nightmare({show: true});
const baseUrl = 'http://www.nhm.ac.uk';

nm.goto(baseUrl + '/discover/dino-directory/name/name-az-all.html')
  .evaluate(function() {
    let results = [];
    let dinoLinks = document.querySelectorAll('.dino-list a');

    // for(let i=0; i < dinoLinks.length; i++) {
    for(let i=0; i < 5; i++) {
      results.push(dinoLinks[i].getAttribute('href'));
    }

    return results;
  }).then(crawl).catch(bail);

function crawl(urls) {
  if (urls.length < 2) {
    nm.goto(baseUrl + urls.pop())
      .evaluate(scrape)
      .end()
      .then(function(result) {
        console.log(result);
      })
      .catch(bail);
  } else {
    nm.goto(baseUrl + urls.pop())
      .evaluate(scrape)
      .then(function(result) {
        console.log(result);
        crawl(urls);
      })
      .catch(bail);
  }
}

function scrape() {
  return document.querySelector('.dino-facts dd').innerText;
}

function bail(err) {
  console.error(err);
}


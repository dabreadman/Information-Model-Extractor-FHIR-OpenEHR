// Run this on https://www.hl7.org/fhir/resourcelist.html to scrap
// Step 1. Go to https://www.hl7.org/fhir/resourcelist.html
// Step 2. Ctrl+Shift+I **OR** Right Click-> Inspect Element
// Step 3. Go to the "Console" tab
// Step 4. Copy and paste this
// Step 5. Enter
// Step 6. Wait (~5 seconds, depending on network)
// Step 7. The models have been downloaded as FHIR.json

const puppeteer = require("puppeteer");
let cells = document.querySelectorAll(
  ".frm-contents > td > ul > li > a:first-child"
);

let hrefs = Array.from(cells).map((cell) => cell.href);

let FHIR = {};

(async () => {
  try {
    var start = new Date().getTime();
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // go to each page
    await page.goto("https://www.hl7.org/fhir/resourcelist.html");
    await page.waitForSelector(".frm-contents > td > ul > li > a:first-child", {
      timeout: 10000,
    });

    await page.evaluate(() => {
      // go to each href
      let promises = hrefs.map((href) =>
        fetch(href)
          .then((res) => res.text())
          .then((responseText) => {
            const doc = new DOMParser().parseFromString(
              responseText,
              "text/html"
            );
            // select span
            let spec = doc.querySelector("#json-inner > .spec");
            let dirty = spec.textContent;
            // this removes all javascript comments
            let noVisibleComment = dirty.replaceAll(/\/\/[^\n]*/g, "");
            // this removes comments that was not prepended with //
            let noComment = noVisibleComment.replaceAll(/^[^"{}]+\n/gm, "");
            // https://www.hl7.org/fhir/substancespecification.html
            // this adds quotes to attributes that were missing
            let attributesWithQuotes = noComment.replaceAll(
              /"?<(\w+)>"?/g,
              '"<$1>"'
            );
            // this adds "" to object attributes to make them valid
            let stringifyObjects = attributesWithQuotes.replaceAll(
              /{([^},"]+)}/g,
              '"{$1}"'
            );
            // this adds commas to make json valid
            let fixCommas = stringifyObjects.replaceAll(/("[\s]+)"/gm, '$1,"');
            // cleanup for json parser
            let cleanWithoutNewLines = fixCommas.replaceAll(/\n/g, "");

            try {
              let parsedJson = JSON.parse(cleanWithoutNewLines);
              let { resourceType, ...actualJson } = parsedJson;
              FHIR[resourceType] = actualJson;
            } catch (e) {
              console.log(fixCommas);
              console.debug(e);
            }
          })
      );

      await promises;
    });

    var end = new Date().getTime();
    console.log(end - start);
    await browser.close();
    console.log();

    fs.writeFile("openehr.json", JSON.stringify(openEHR, null, 2), () => {
      console.log("Done: EHR");
    });
  } catch (error) {
    console.log(error);
  }
})();

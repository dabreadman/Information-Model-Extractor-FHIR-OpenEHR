// Run this on https://www.hl7.org/fhir/resourcelist.html to scrap
// Step 1. Go to https://www.hl7.org/fhir/resourcelist.html
// Step 2. Ctrl+Shift+I **OR** Right Click-> Inspect Element
// Step 3. Go to the "Console" tab
// Step 4. Copy and paste this
// Step 5. Enter
// Step 6. Wait (~5 seconds, depending on network)
// Step 7. The models have been downloaded as FHIR.json

let cells = document.querySelectorAll(
  ".frm-contents > td > ul > li > a:first-child"
);

let hrefs = Array.from(cells).map((cell) => cell.href);

let FHIR = {};
// go to each href
let promises = hrefs.map((href) =>
  fetch(href)
    .then((res) => res.text())
    .then((responseText) => {
      const doc = new DOMParser().parseFromString(responseText, "text/html");
      // select span
      let spec = doc.querySelector("#json-inner > .spec");
      let dirty = spec.textContent;
      // this removes all javascript comments
      let noVisibleComment = dirty.replaceAll(/\/\/[^\n]*/g, "");
      // this removes comments that was not prepended with //
      let noComment = noVisibleComment.replaceAll(/^[^"{}]+\n/gm, "");
      // https://www.hl7.org/fhir/substancespecification.html
      // this adds quotes to attributes that were missing
      let attributesWithQuotes = noComment.replaceAll(/"?<(\w+)>"?/g, '"<$1>"');
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
        // parse as JSON
        let parsedJson = JSON.parse(cleanWithoutNewLines);
        console;

        // get number of required attributes
        let structTab = doc.querySelector("#tabs-struc");
        let nRequired = structTab.querySelectorAll(
          'a[href="terminologies.html#required'
        ).length;
        let nAttributes = Object.keys(parsedJson).length;
        parsedJson["_nAttributes"] = nAttributes;
        parsedJson["_nRequired"] = nRequired;

        // add sourceUrl
        parsedJson["_SourceUrl"] = href;
        let { resourceType, ...actualJson } = parsedJson;
        FHIR[resourceType] = actualJson;
      } catch (e) {
        console.log(fixCommas);
        console.debug(e);
      }
    })
);

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

Promise.all(promises)
  .then(() => {
    console.log(FHIR);
    console.log(Object.keys(FHIR).length);
  })
  .then(() => {
    download(JSON.stringify(FHIR, null, 2), "fhir.json", "application/json");
  });

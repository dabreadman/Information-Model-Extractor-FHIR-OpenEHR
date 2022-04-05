const puppeteer = require("puppeteer");
const fs = require("fs");

// goto("https://ckm.openehr.org/ckm/");
// Click "published"
// Click "Expand all"
// Ctrl+Shift+I **OR** Right Click-> Inspect Element
// Go to the "Console" tab
// Copy and paste this
// ```
// let selectedIds = document.querySelectorAll(
//   ".x-tree-node-el.x-tree-node-leaf.x-unselectable"
// );
// let ids = Array.from(selectedIds).map((sel) =>
//   sel.getAttribute("ext:tree-node-id")
// );
// let actualIds = ids.filter((id) => id.match(/[0-9]+.[0-9]+.[0-9]+/));
// console.log(actualIds);
// ```

const ids = [
  "1013.1.587",
  "1013.1.5077",
  "1013.1.1995",
  "1013.1.1971",
  "1013.1.5948",
  "1013.1.3718",
  "1013.1.218",
  "1013.1.5827",
  "1013.1.5828",
  "1013.1.5830",
  "1013.1.5829",
  "1013.1.1846",
  "1013.1.1975",
  "1013.1.3749",
  "1013.1.3750",
  "1013.1.3751",
  "1013.1.3753",
  "1013.1.3752",
  "1013.1.3754",
  "1013.1.4898",
  "1013.1.3756",
  "1013.1.3757",
  "1013.1.3759",
  "1013.1.3283",
  "1013.1.4513",
  "1013.1.393",
  "1013.1.1972",
  "1013.1.5699",
  "1013.1.3748",
  "1013.1.2881",
  "1013.1.2886",
  "1013.1.1800",
  "1013.1.17",
  "1013.1.5947",
  "1013.1.2380",
  "1013.1.1451",
  "1013.1.3762",
  "1013.1.4863",
  "1013.1.2672",
  "1013.1.3181",
  "1013.1.331",
  "1013.1.195",
  "1013.1.2753",
  "1013.1.2245",
  "1013.1.2246",
  "1013.1.4191",
  "1013.1.1425",
  "1013.1.120",
  "1013.1.1969",
  "1013.1.286",
  "1013.1.4726",
  "1013.1.1322",
  "1013.1.1324",
  "1013.1.18",
  "1013.1.1970",
  "1013.1.1395",
  "1013.1.123",
  "1013.1.204",
  "1013.1.4213",
  "1013.1.4274",
  "1013.1.4902",
  "1013.1.1713",
  "1013.1.1521",
  "1013.1.409",
  "1013.1.3155",
  "1013.1.3273",
  "1013.1.1388",
  "1013.1.1670",
  "1013.1.3184",
  "1013.1.2733",
  "1013.1.2737",
  "1013.1.2469",
  "1013.1.2989",
  "1013.1.3715",
  "1013.1.124",
  "1013.1.176",
  "1013.1.3287",
  "1013.1.5655",
  "1013.1.1662",
  "1013.1.1093",
  "1013.1.2965",
  "1013.1.2593",
  "1013.1.169",
  "1013.1.290",
  "1013.1.5755",
  "1013.1.2817",
  "1013.1.2378",
  "1013.1.2466",
  "1013.1.3317",
  "1013.1.4866",
  "1013.1.1336",
  "1013.1.3574",
  "1013.1.2893",
  "1013.1.3670",
  "1013.1.3790",
  "1013.1.3669",
  "1013.1.1318",
  "1013.1.2796",
  "1013.1.2960",
  "1013.1.1014",
  "1013.1.5150",
  "1013.1.4685",
  "1013.1.2422",
  "1013.1.4691",
  "1013.1.3054",
  "1013.1.4694",
  "1013.1.4695",
  "1013.1.1385",
  "1013.1.276",
  "1013.1.1317",
  "1013.1.3819",
  "1013.1.1682",
  "1013.1.1671",
  "1013.1.1683",
  "1013.1.137",
  "1013.1.2555",
  "1013.1.3210",
  "1013.1.2815",
  "1013.1.5800",
  "1013.1.2361",
  "1013.1.2191",
  "1013.1.5078",
  "1013.1.1922",
  "1013.1.5657",
  "1013.1.3053",
  "1013.1.4671",
  "1013.1.1368",
  "1013.1.2423",
  "1013.1.3342",
  "1013.1.1493",
  "1013.1.1202",
  "1013.1.2836",
  "1013.1.5854",
  "1013.1.1296",
  "1013.1.4537",
  "1013.1.271",
  "1013.1.1647",
  "1013.1.3084",
  "1013.1.4295",
  "1013.1.3813",
  "1013.1.4218",
  "1013.1.68",
  "1013.1.2290",
  "1013.1.2798",
  "1013.1.2863",
  "1013.1.1200",
  "1013.1.150",
  "1013.1.2814",
  "1013.1.5066",
  "1013.1.5946",
  "1013.1.614",
  "1013.1.3539",
  "1013.1.631",
  "1013.1.273",
  "1013.1.5356",
  "1013.1.5922",
  "1013.1.25",
  "1013.1.5942",
  "1013.1.5914",
  "1013.1.371",
  "1013.1.5358",
  "1013.1.5359",
  "1013.1.5797",
  "1013.1.5972",
  "1013.1.5606",
  "1013.1.5162",
  "1013.1.5605",
  "1013.1.5973",
  "1013.1.6133",
  "1013.1.6128",
  "1013.1.4448",
  "1013.1.4677",
  "1013.1.4442",
  "1013.1.4439",
  "1013.1.4432",
];

let openEHR = {};
(async () => {
  try {
    var start = new Date().getTime();
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // go to each page
    for (let i = 0; i < ids.length; i++) {
      id = ids[i];
      console.log("[" + i + "] Starting: " + id);
      await page.goto(`https://ckm.openehr.org/ckm/archetypes/${id}`);
      try {
        await page.waitForSelector(".x-tab-panel-body .x-tab-panel-body-top", {
          timeout: 50000,
        });
        await page.waitForSelector(
          ".x-panel.oi-font-heading.x-panel-noborder",
          {
            timeout: 50000,
          }
        );
      } catch {
        console.log("timed-out: " + id);
      }

      let [archetype, dict] = await page.evaluate(() => {
        try {
          let tabs = document.querySelector(
            ".x-tab-panel-body .x-tab-panel-body-top"
          );
          if (tabs.childNodes.length < 3) {
            return [-1, null];
          }
          let tab = tabs.childNodes[2];
          let table = tab.querySelector(".x-table-layout");

          let archetype = document
            .querySelectorAll(".x-panel.oi-font-heading.x-panel-noborder")[1]
            .textContent.trim()
            .split(" latest revision")[0];

          let tableBody = table.firstChild;
          let tableRows = Array.from(tableBody.childNodes);
          // First is trash
          if (tableRows.length > 1) {
            tableRows.shift();
          }
          let dict = {};
          let nRequired = 0;
          tableRows.forEach((row) => {
            try {
              let attribute = row.querySelector(".oi-item-text").innerText;
              let type = row
                .querySelector("font")
                .textContent.replace("\n", " ")
                .trim();
              dict[attribute] = type;
              if (type.toLowerCase().includes("mandatory")) {
                nRequired += 1;
              }
            } catch (e) {
              console.log(e);
            }
          });

          let nAttributes = Object.keys(dict).length;
          dict["_nAttributes"] = nAttributes;
          dict["_nRequired"] = nRequired;

          let authorName = Array.from(
            document.querySelectorAll(".x-panel-bwrap > div > br")
          )
            .map((b) => b.parentElement.innerText)
            .filter((txt) => txt.match(/Author name:.*/))[0]
            .split(": ")[1]
            .split("\n")[0]
            .replace("Organisation", "");
          dict["_AuthorName"] = authorName;

          return [archetype, dict];
        } catch (e) {
          console.log(e);
          console.log(id);
        }
      });
      if (dict !== null) {
        dict["_SourceUrl"] = `https://ckm.openehr.org/ckm/archetypes/${id}`;
        openEHR[archetype] = dict;
        console.log("[" + i + "] Done: " + id);
      } else {
        console.log("[" + i + "] Invalid: " + id);
      }
    }

    var end = new Date().getTime();
    console.log("Time spent:" + (end - start));
    await browser.close();
    console.log();

    fs.writeFile("openehr.json", JSON.stringify(openEHR, null, 2), () => {
      console.log("Done: EHR");
    });
  } catch (error) {
    console.log(error);
  }
})();

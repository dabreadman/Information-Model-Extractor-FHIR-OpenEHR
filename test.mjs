import fetch from "node-fetch";
import DOMParser from "dom-parser";

fetch("https://www.hl7.org/fhir/resourcelist.html")
  .then((res) => res.text())
  .then((responseText) => {
    console.log(responseText);
    const doc = new DOMParser().parseFromString(responseText, "text/html");
    const h1 = doc.querySelector("h1");
    console.log(h1.textContent);
  });

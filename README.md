# Information-Model-Extractor-FHIR-OpenEHR

## To extract information models

### FHIR
1. Follow instructions in `scraping/fhir.js`.
2. This results in a JSON file.

### OpenEHR
1. Install NodeJS.
2. Install dependencies with `npm install`
3. Follow the instruction in `scraping/openehr.js`, and copy the list of ids.
4. Edit and `node scraping/openehr.js`.
5. This results in a JSON file.

## To analyse information models

1. Move the JSON files into `models/` (to replace old models, extracted on 2nd April 2022). 
2. Run `node models/analyse_FHIR.js` to analyse FHIR  
OR  
`node models/analyse_openehr.js` to analyse OpenEHR


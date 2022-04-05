let models = require("./openehr.json");

let res = {};
let nTotalAttributes = 0;

// Representational: Coded Texts
let nCodedAttributes = 0;
let modelWithCodedAttributes = [];
let codedAttributesHistogram = {};

// Timeliness: Time-related
let nTimeAttributes = 0;
let timeAttributesHistogram = {};
let modelsWithTime = [];
let attributesNameWithTime = [" time", "time ", "duration", "date"];

// Reputation: Authors
let authors = [];

// Completness: Required Attributes
let nRequiredAttributes = 0;
let nOptionalAttributes = 0;
let modelsWithRequiredAttribute = [];
let requiredAttributesHistogram = {};

// Representational
// For each model
for (let [modelName, model] of Object.entries(models)) {
  let nCodedAttributesLocal = 0;
  // For each attribute:type
  for (let [_, type] of Object.entries(model)) {
    type = type.toString().toLowerCase();
    if (type.includes("coded text")) {
      nCodedAttributesLocal += 1;
    }
  }

  let nLocalAttributes = model["_nAttributes"];
  nCodedAttributes += nCodedAttributesLocal;

  if (nCodedAttributesLocal > 0) {
    modelWithCodedAttributes.push(modelName);
  }

  let id = resolveId(nCodedAttributesLocal, nLocalAttributes);
  if (codedAttributesHistogram[id] === undefined) {
    codedAttributesHistogram[id] = [];
  }
  codedAttributesHistogram[id].push(modelName);
}

// Timeliness
// For each model
for (let [modelName, model] of Object.entries(models)) {
  let nTimeLocal = 0;
  // For each attribute:type
  for (let [attribute, type] of Object.entries(model)) {
    attribute = attribute.toLowerCase();
    type = type.toString().toLowerCase();
    if (attributesNameWithTime.some((attr) => attribute.includes(attr))) {
      nTimeLocal += 1;
    } else if (type.includes("date")) {
      nTimeLocal += 1;
    }
  }
  let nLocalAttributes = model["_nAttributes"];
  nTotalAttributes += nLocalAttributes;
  if (nTimeLocal) {
    modelsWithTime.push(modelName);
    nTimeAttributes += nTimeLocal;
  }

  let timeId = resolveId(nTimeLocal, nLocalAttributes);
  if (timeAttributesHistogram[timeId] === undefined) {
    timeAttributesHistogram[timeId] = [];
  }
  timeAttributesHistogram[timeId].push(modelName);
}

// Reputation
// For each model
for (let [modelName, model] of Object.entries(models)) {
  let author = model["_AuthorName"];

  if (authors[author] === undefined) {
    authors[author] = [];
  }
  authors[author].push(modelName);
}

// Completeness
// For each model
for (let [modelName, model] of Object.entries(models)) {
  // For each attribute:type
  let nRequiredAttributesLocal = model["_nRequired"];
  let nAttributesLocal = model["_nAttributes"];
  nRequiredAttributes += nRequiredAttributesLocal;
  nOptionalAttributes += nAttributesLocal - nRequiredAttributesLocal;
  let id = resolveId(nRequiredAttributesLocal, nAttributesLocal);
  if (requiredAttributesHistogram[id] === undefined) {
    requiredAttributesHistogram[id] = [];
  }
  requiredAttributesHistogram[id].push(modelName);
  if (nRequiredAttributesLocal > 0) {
    modelsWithRequiredAttribute.push(modelName);
  }
}

/*
// Example
// For each model
for (let [modelName, model] of Object.entries(models)) {
  // For each attribute:type
  for (let [attribute, type] of Object.entries(model)) {
  }
}
*/

// console.log("Representational");
// console.log({ nCodedAttributes });
// console.log({ nTotalAttributes });
// console.log("nModels: " + Object.entries(models).length);
// console.log("nModelsWithCodedAttributes: " + modelWithCodedAttributes.length);
// console.log(
//   "% with Coded: " +
//     modelWithCodedAttributes.length / Object.entries(models).length
// );

// console.log("------------------------");
// for (const [id, lst] of Object.entries(codedAttributesHistogram)) {
//   console.log(id + ": " + lst.length);
// }
// console.log("------------------------");

// console.log("Timeliness");
// console.log({ nTimeAttributes });
// console.log({ nTotalAttributes });
// console.log("nModels: " + Object.entries(models).length);
// console.log("nModelsWithTime: " + modelsWithTime.length);

// console.log("------------------------");
// for (const [id, lst] of Object.entries(timeAttributesHistogram)) {
//   console.log(id + ": " + lst.length);
// }
// console.log("------------------------");

console.log("Reputation");
console.log("Number of authors: " + Object.entries(authors).length);

console.log("------------------------");
for (const [author, lst] of Object.entries(authors)) {
  console.log(author + ": " + lst.length);
}
console.log("------------------------");

// console.log("Completeness");
// console.log({ nRequiredAttributes });
// console.log({ nOptionalAttributes });
// console.log("nModels: " + Object.entries(models).length);
// console.log("Models with required: " + modelsWithRequiredAttribute.length);
// console.log(
//   "% with Required: " +
//     modelsWithRequiredAttribute.length / Object.entries(models).length
// );

// console.log("------------------------");
// for (const [id, lst] of Object.entries(requiredAttributesHistogram)) {
//   console.log(id + ": " + lst.length);
// }
// console.log("------------------------");

function resolveId(divident, divisor) {
  let percentage = divident / divisor;
  let id = parseInt(percentage * 10) * 10;
  if (isNaN(percentage)) {
    id = 0;
  }
  return id;
}

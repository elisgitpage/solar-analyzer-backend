//const fs = require('fs');
import got from "got";
import jsdom from "jsdom";
import { exec } from "child_process";
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
const { JSDOM } = jsdom;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let app = express();

console.log(__dirname);

app.use(
  cors({
    origin: "*",
  })
);

// Route that responds to GET requests with our html page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// This sends JSON in response to a GET request at /api
app.get("/api", (req, res) => {
  res.json({ msg: "Hello, from the server!" });
});

// Sets the app to listen on Port 4001 and lets us know
app.listen(4001, () => {
  console.log("Server listening on Port 4001.");
});

const solargisUrl = "https://solargis.com/maps-and-gis-data/overview";
let allOptions = [];

got(solargisUrl)
  .then((response) => {
    const dom = new JSDOM(response.body);
    // dom.window.document.querySelectorAll('a').forEach(link => {
    //   console.log(link.href);
    // });
    const dropdowns = dom.window.document.getElementsByClassName("select2");
    for (let dropdown of dropdowns) {
      // dropdown.classList.forEach((classToken) => {
      //   console.log(classToken);
      // });

      let category;
      if (dropdown.classList.contains("regions")) {
        category = "REGIONS";
      } else if (dropdown.classList.contains("countries")) {
        category = "COUNTRIES";
      } else {
        category = "UNKNOWN";
      }
      //console.log(`*************** ${category} ***************`);

      //console.log(dropdown.options);
      //console.log(dropdown.options.length);
      let url, optionName, locationOption;
      for (let option of dropdown.options) {
        optionName = option.innerHTML.trim();
        if (optionName === "Select region" || optionName === "Select country") {
          continue;
        }
        //console.log(optionName);
        url = "https://solargis.com/" + option.value;
        //console.log(url);
        locationOption = { url, name: optionName };
        allOptions.push(locationOption);
      }
      // dropdown.options.forEach(option => {
      //   console.log(option);
      // })
    }

    main();
  })
  .catch((err) => {
    console.log(err);
  });

function main() {
  console.log(allOptions.length);
  console.log(allOptions[0].url);
  var url = allOptions[0].url;
  var start =
    process.platform == "darwin"
      ? "open"
      : process.platform == "win32"
      ? "start"
      : "xdg-open";
  exec(start + " " + url);
}

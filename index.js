const { writeFile } = require("fs");
const { join } = require("path");
const axios = require("axios");
const blend = require("@mapbox/blend");
const argv = require("minimist")(process.argv.slice(2));

const {
  greeting = "Hello",
  who = "You",
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
} = argv;

const firstReq = `https://cataas.com/cat/says/${greeting}?width=${width}&height=${height}&color=${color}&s=${size}`;
const secondReq = `https://cataas.com/cat/says/${who}?width=${width}&height=${height}&color=${color}&s=${size}`;

const createImages = (firstRes, secondRes, width, height) =>
  blend(
    [
      { buffer: Buffer.from(firstRes, "binary"), x: 0, y: 0 },
      { buffer: Buffer.from(secondRes, "binary"), x: width, y: 0 },
    ],
    { width: width * 2, height, format: "jpeg" },
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const fileOut = join(process.cwd(), `/cat-card.jpg`);

      writeFile(fileOut, data, "binary", (err) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log("The file was saved!");
      });
    }
  );

//Self-Invoking Anonymous Function
(async function () {
  try {
    const firstRes = await axios.get(firstReq, {
      responseType: "arraybuffer",
    });
    const secondRes = await axios.get(secondReq, {
      responseType: "arraybuffer",
    });
    console.log("myRes", firstRes, secondRes);

    createImages(firstRes.data, secondRes.data, width, height);
  } catch (err) {
    console.error(err);
    return;
  }
})();

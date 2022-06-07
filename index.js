const { writeFile } = require("fs");
const { join } = require("path");
const request = require("request-promise");
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

const firstReq = {
  // https://cataas.com/cat/says/Hi%20There?width=500&amp;height=800&amp;c=Cyan&amp;s=150
  url: `https://cataas.com/cat/says/${greeting}?width=${width}&height=${height}&color=${color}&s=${size}`,
  encoding: "binary",
};

const secondReq = {
  url: `https://cataas.com/cat/says/${who}?width=${width}&height=${height}&color=${color}&s=${size}`,
  encoding: "binary",
};

function createImages(firstRes, secondRes, width, height) {
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
}

//Self-Invoking Anonymous Function
(async function () {
  try {
    const firstRes = await request(firstReq);
    const secondRes = await request(secondReq);
    console.log("myRes", firstRes, secondRes);

    createImages(firstRes, secondRes, width, height);
  } catch (err) {
    console.error(err);
    return;
  }
})();

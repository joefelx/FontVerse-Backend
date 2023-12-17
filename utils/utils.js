const Font = require("../model/Font");

let formatString = "";

async function getFont(fontFamily) {
  formatString = "";
  fontFamily.map(async (font) => {
    const fontFound = await Font.find({
      fontName: font,
    });

    await writeCss(fontFound);
  });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(formatString);
    }, 500);
  });
}

async function writeCss(fontFound) {
  fontFound[0].fontWeights.map((w) => {
    formatString += `

  @font-face {
    font-family: '${fontFound[0].fontName}';
    src: url('${w.fontURL}') format('woff2');
    font-weight: ${w.fontWeight};
  }`;
  });

  console.log("rendered");
  return "rendered";
}

module.exports = { getFont };

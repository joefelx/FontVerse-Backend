const Font = require("../model/Font");

let formatString = "";

async function getFont(fontFamily) {
  formatString = "";
  fontFamily.map(async (font) => {
    const fontFound = await Font.find({
      fontName: font,
    });

    fontFound.map((f) => {
      writeCss(font, f["fontWeight"], f["fontUrl"]);
    });
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(formatString);
    }, 500);
  });
  // return formatString;
}

function writeCss(fontFamily, fontWeight, fontUrl) {
  formatString += `

@font-face {
  font-family: '${fontFamily}';
  src: url('${fontUrl}') format('woff2');
  font-weight: ${fontWeight};
}`;
}

module.exports = { getFont };

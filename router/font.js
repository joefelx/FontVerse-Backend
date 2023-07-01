const router = require("express").Router();

const User = require("../model/User");
const Font = require("../model/Font");

const upload = require("../storage");
const { getFont } = require("../utils/utils");

// create font style and store in db
router.post("/upload", upload.single("font"), async (req, res) => {
  const file = req.file;
  const { userId, fontName, fontDetails, fontWeight, price } = req.body;

  const fontRefactor = {
    userId,
    fontName,
    fontDetails,
    fontWeights: {
      fontWeight,
      fontURL: `https://font-verse-api.onrender.com/fonts/${file.filename}`,
    },
    price,
  };

  try {
    const checkAdmin = await User.findById(userId);
    if (checkAdmin.admin) {
      // create new font object
      const font = await Font(fontRefactor);
      const savedFont = await font.save();
      res.status(200).json({
        status: "success",
        data: savedFont,
      });
    } else {
      res.status(400).json({
        status: "failed",
        data: "You are not permitted",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      data: "You are not permitted",
    });
  }
});

router.post("/update", upload.single("font"), async (req, res) => {
  const file = req.file;
  const { fontName, fontWeight } = req.body;

  const font = await Font.findOne({ fontName: fontName });

  await font.updateOne({
    $push: {
      fontWeights: {
        fontWeight,
        fontURL: `https://font-verse-api.onrender.com/fonts/${file.filename}`,
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: "Updated",
  });
});

// returning the font style to the project url
router.get("/style", async (req, res) => {
  let fontFamily = req.query.fontFamily;
  let splitname = fontFamily.split(",");

  let formatString = await getFont(splitname);
  res.format({
    "text/css": async function () {
      res.send(formatString);
    },
  });
});

// get all fonts
router.get("/all", async (req, res) => {
  try {
    const fonts = await Font.find();
    res.status(200).json(fonts);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      data: error,
    });
  }
});

// get a font
router.get("/", async (req, res) => {
  const fontName = req.query.fontName;
  const fontWeight = req.query.fontWeight;

  try {
    const fonts = fontName
      ? await Font.find({ fontName: fontName })
      : await Font.find({ fontWeight: fontWeight });

    res.status(200).json({
      status: "success",
      data: fonts,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      data: error,
    });
  }
});

module.exports = router;

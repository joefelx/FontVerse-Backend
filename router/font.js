const router = require("express").Router();
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");

const Font = require("../model/Font");
const supabase = require("../storage");
const { getFont } = require("../utils/utils");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../backend/public/fonts");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// create font style and store in db
router.post("/upload", upload.single("font"), async (req, res) => {
  const file = req.file;
  const font = await Font(req.body);

  try {
    // create new font object
    const savedFont = await font.save();
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      data: error,
    });
  }
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

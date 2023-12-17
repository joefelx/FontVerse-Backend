const mongoose = require("mongoose");

const FontSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fontName: {
      type: String,
      required: true,
    },
    fontDetails: {
      type: String,
      default: "",
    },
    fontWeights: {
      type: Array,
      default: [
        {
          fontWeight: {
            type: String,
          },
          fontURL: {
            type: String,
          },
        },
      ],
    },
    fontStyle: {
      type: String,
      default: "normal",
    },
    price: {
      type: String,
      default: "FREE",
    },
    type: {
      type: String,
      default: "woff2",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Font", FontSchema);

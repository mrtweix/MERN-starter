import mongoose from "mongoose";
import config from "../config/config.js";

const TokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        config.ACCESS_TOKEN,
        config.REFRESH_TOKEN,
        config.VERIFY_EMAIL_TOKEN,
        config.RESET_PASSWORD_TOKEN,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    toObject: {
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model("Token", TokenSchema);
export default Token;

const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  expiresAt: {
    type: Date,
    default: null, // null = never expires
  },

  isActive: {
    type: Boolean,
    default: true, // allows user to manually disable the URL
  },
  ipAddress: {
    type: String,
    default: null, 
  },
});

module.exports = mongoose.model("Url", UrlSchema);

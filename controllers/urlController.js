const { generateShortId } = require("../utils/helper");
const Url = require("../models/Url");

exports.createShortUrl = async (req, res) => {
  try {
    let { url, customId, expiresAt } = req.body;

    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "URL is required" });
    }

    // Check if URL starts with http:// or https://, if not, prepend https://
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    if (customId) {
      const existingUrl = await Url.findOne({ shortUrl: customId });

      if (existingUrl) {
        return res.status(400).json({
          success: false,
          message: "Custom short URL already in use. Please try another.",
        });
      }
    } else {
      customId = await generateShortId(7);
    }
    const userId = req.user?._id;
    const guestIp = req.ip;
    // console.log("UserId in createShortUrl: ", userId);
    // console.log("MY IP: ", guestIp);

    if (!userId) {
      const guestUrlCount = await Url.countDocuments({ ipAddress: guestIp });

      if (guestUrlCount >= 50) {
        return res.status(403).json({
          success: false,
          message: "Guest limit reached. Please log in to create more URLs.",
        });
      }
    }

    const newUrl = new Url({
      originalUrl: url,
      shortUrl: customId,
      user: userId || null,
      expiresAt: expiresAt || null,
      ipAddress: guestIp,
    });

    await newUrl.save();

    res.status(201).json({
      success: true,
      shortUrl: `http://localhost:3000/${customId}`,
      originalUrl: url,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }
};

exports.redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const urlEntry = await Url.findOne({ shortUrl: shortId });

    if (!urlEntry) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }
    const now = new Date();

    if (!urlEntry.isActive) {
      return res
        .status(410)
        .json({ success: false, message: "This URL has been deactivated." });
    }

    if (urlEntry.expiresAt && now > urlEntry.expiresAt) {
      return res
        .status(410)
        .json({ success: false, message: "This URL has expired." });
    }

    urlEntry.clicks += 1;
    await urlEntry.save();

    return res.redirect(urlEntry.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }
};

exports.deleteShortUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the URL by shortUrl and verify ownership
    const urlEntry = await Url.findOne({ 
      shortUrl: id,
      user: userId
    });

    if (!urlEntry) {
      return res.status(404).json({
        success: false,
        message: "URL not found or you don't have permission to delete it",
      });
    }

    // Delete the URL
    await Url.findByIdAndDelete(urlEntry._id);

    return res.status(200).json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting URL",
      error: error.message,
    });
  }
};

exports.updateShortUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, customId, expiresAt } = req.body;
    const userId = req.user._id;

    // Validate at least one field is provided
    if (!url && !customId && !expiresAt) {
      return res.status(400).json({
        success: false,
        message: "At least one field (url, customId, or expiresAt) is required",
      });
    }

    // Find the existing URL
    const existingUrl = await Url.findOne({ shortUrl: id });
    if (!existingUrl) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    // Verify user owns the URL
    if (existingUrl.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this URL",
      });
    }

    // Prepare update object
    const updateFields = {};

    // Validate and update URL if provided
    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        updateFields.originalUrl = `https://${url}`;
      } else {
        updateFields.originalUrl = url;
      }
    }

    // Validate and update customId if provided
    if (customId) {
      if (!/^[a-zA-Z0-9-]+$/.test(customId)) {
        return res.status(400).json({
          success: false,
          message: "Custom ID can only contain letters, numbers, and hyphens",
        });
      }

      // Check if customId is already taken (excluding current URL)
      const idExists = await Url.findOne({
        shortUrl: customId,
        _id: { $ne: existingUrl._id }
      });
      
      if (idExists) {
        return res.status(400).json({
          success: false,
          message: "Custom ID already in use",
        });
      }

      updateFields.shortUrl = customId;
    }

    // Validate and update expiration if provided
    if (expiresAt) {
      const expirationDate = new Date(expiresAt);
      if (isNaN(expirationDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiration date format",
        });
      }
      updateFields.expiresAt = expirationDate;
    } else if (expiresAt === null) {
      updateFields.expiresAt = null;
    }

    // Perform the update
    const updatedUrl = await Url.findByIdAndUpdate(
      existingUrl._id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "URL updated successfully",
      data: {
        shortUrl: updatedUrl.shortUrl,
        originalUrl: updatedUrl.originalUrl,
        expiresAt: updatedUrl.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error updating URL:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating URL",
      error: error.message,
    });
  }
};

exports.getUrlStats = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user;
    
    const urlEntry = await Url.findOne({ shortUrl: id });

    if (!urlEntry) {
      return res.status(404).json({ 
        success: false, 
        message: "URL not found" 
      });
    }

    // Check if the logged-in user is the owner of the URL
    if (loggedInUser._id.toString() !== urlEntry.user?.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized access" 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        shortUrl: urlEntry.shortUrl,
        originalUrl: urlEntry.originalUrl,
        clicks: urlEntry.clicks,
        expiresAt: urlEntry.expiresAt,
        isActive: urlEntry.isActive,
        createdAt: urlEntry.createdAt
      },
    });
  } catch (error) {
    console.error("Error fetching URL stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

exports.deactivateUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const urlEntry = await Url.findOne({
      shortUrl: shortId,
    });

    if (!urlEntry) {
      return res
        .status(404)
        .json({ success: false, message: "URL not found or access denied." });
    }

    urlEntry.isActive = false;
    await urlEntry.save();

    res
      .status(200)
      .json({ success: true, message: "Short URL has been deactivated." });
  } catch (error) {
    console.error("Error deactivating URL:", error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const userId = req.user._id;
    const urls = await Url.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: urls
    });
  } catch (error) {
    console.error("Error fetching user URLs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch URLs"
    });
  }
};
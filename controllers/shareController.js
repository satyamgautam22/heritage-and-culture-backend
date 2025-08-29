// controllers/shareController.js
import Share from "../models/share.js";
import { v4 as uuidv4 } from "uuid";

// Start a new live location sharing session
export const createShare = async (req, res) => {
  try {
    const shareId = uuidv4();
    const newShare = new Share({ shareId });
    await newShare.save();

    res.json({
      success: true,
      shareId,
      shareUrl: `http://localhost:5173/live/${shareId}`, // frontend link
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stop sharing
export const stopShare = async (req, res) => {
  try {
    const { shareId } = req.params;
    const share = await Share.findOneAndUpdate({ shareId }, { isActive: false });

    if (!share) {
      return res.status(404).json({ success: false, message: "Share not found" });
    }

    res.json({ success: true, message: "Sharing stopped" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate if a share link is active
export const getShare = async (req, res) => {
  try {
    const { shareId } = req.params;
    const share = await Share.findOne({ shareId, isActive: true });

    if (!share) {
      return res.status(404).json({ success: false, message: "Not found or inactive" });
    }

    res.json({ success: true, shareId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

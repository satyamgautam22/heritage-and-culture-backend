import Chat from "../models/chat.js";
import GuideBooking from "../models/guideBooking.js";

// create chat using guide booking
export const createChat = async (req, res) => {
  try {
    const userId = req.user.id;            // from JWT
    const bookingId = req.params.bookingId;      // from URL

    // 1️⃣ find booking
    const booking = await GuideBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 2️⃣ ensure logged-in user owns this booking
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // 3️⃣ ensure guide is assigned
    if (!booking.guideId) {
      return res.status(400).json({ error: "Guide not assigned yet" });
    }

    const guideId = booking.guideId;

    // 4️⃣ check existing chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, guideId] }
    });

    if (chat) {
      return res.status(200).json(chat);
    }

    // 5️⃣ create new chat
    chat = await Chat.create({
      participants: [userId, guideId]
    });

    return res.status(201).json(chat);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

import GuideBooking from "../models/guideBooking.js";
import stripe from "../config/stripe.js"

export const createBooking = async (req, res) => {
  try {
    const { name, email, mobile, location, date, time, budget } = req.body;
    const userId = req.userId || req.body.userId; // <-- prefer token

    if (!name || !email || !mobile || !location || !date || !time || !budget) {
      return res.status(400).json({ message: "Please fill all details" });
    }

    const ifexist = await GuideBooking.findOne({ location, date, time });
    if (ifexist) {
      return res.status(400).json({
        message: "You already have a booking at this location, date & time",
      });
    }

    const booking = new GuideBooking({
      name,
      email,
      mobile,
      location,
      date,
      time,
      budget,
      userId,                      // <-- now comes from auth by default
      paymentStatus: "pending",
    });

    const savedBooking = await booking.save();
    return res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error: " + err.message,
    });
  }
};


// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await GuideBooking.find({});
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

// Get bookings by userId
export const getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await GuideBooking.find({ userId });
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }
    res.status(200).json({ message: "Bookings fetched successfully", bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

// Delete booking by id
export const deleteBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await GuideBooking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({
      message: "Booking deleted successfully",
      deletedBooking,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

// Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await GuideBooking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Guide Booking - ${booking.location}`,
              description: `Date: ${booking.date}, Time: ${booking.time}`,
            },
            unit_amount: booking.budget * 100, // paise
          },
          quantity: 1,
        },
      ],
      customer_email: booking.email,
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",

      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      await GuideBooking.findByIdAndUpdate(session.metadata.bookingId, {
        paymentStatus: "paid",
      });
      return res.json({ message: "Payment successful, booking confirmed" });
    }

    res.status(400).json({ message: "Payment not completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying payment" });
  }
};

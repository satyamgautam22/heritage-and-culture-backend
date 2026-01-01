import jwt from "jsonwebtoken";



export default function auth(req, res, next) {
  console.log("RAW AUTH HEADER:", req.headers.authorization);
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔐 Role-based attachment
    if (decoded.role === "user") {
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
    } else if (decoded.role === "guide") {
      req.guide = {
        id: decoded.id,
        role: decoded.role
      };
    } else {
      return res.status(401).json({ message: "Invalid role in token" });
    }

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

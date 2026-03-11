import jwt from "jsonwebtoken";

export const getUserFromAuthHeader = (req) => {
  try {
    const auth = req.headers?.authorization || "";
    if (!auth.startsWith("Bearer ")) return null;
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (e) {
    return null;
  }
};

import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  let token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      error: true,
      code: "NO_TOKEN",
      message: "Access denied. No token.",
    });
  }

  try {
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { user: { _id: decoded_token.userId } };
    next();
  } catch (error) {
    next(error);
  }
};

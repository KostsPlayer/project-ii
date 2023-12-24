import express from "express";
import configureMiddleware from "./config/middleware.js";
import signupRouter from "./controller/signup.js";
import loginRouter from "./controller/login.js";
import roleRouter from "./controller/roles.js";
import menuRouter from "./controller/menu.js";
import productRouter from "./controller/product.js";
import cartRouter from "./controller/cart.js";
import orderRouter from "./controller/order.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(loginRouter);
app.use(signupRouter);
app.use(roleRouter);
app.use(menuRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);

// Contoh penggunaan try-catch di endpoint "/session"
app.get("/session", configureMiddleware(app), (req, res) => {
  const user = req.session.user[0];

  if (!user) {
    return res.json({ isValid: false, user: user });
  } else {
    return res.json({ isValid: true, user: user });
  }
});

app.get("/users", configureMiddleware(app), (req, res) => {
  const user = req.session.user[0];

  const image = user.image;
  const name = user.name;
  const email = user.email;

  return res.json({
    image: image,
    name: name,
    email: email,
  });
});

app.post("/logout", configureMiddleware(app), (req, res) => {
  req.session.destroy();
  res.clearCookie("shopionzUser");
  return res.json({ message: "Logged out successfully!" });
});

const port = process.env.REACT_APP_PORT || 5001;
app.listen(port, () => {
  console.log(`running server on port ${port}`);
});

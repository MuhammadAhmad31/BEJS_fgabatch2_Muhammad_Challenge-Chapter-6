import express from "express";
import v1Routes from "./routes/v1/index.js";
import { handleErrorResponse } from "./utils/handleResponse.js";
import { PORT } from "./config/env.js";
import session from "express-session";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello, world!");
});

app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true
}));

app.use("/api", v1Routes);

app.use((req, res) => {
  handleErrorResponse(res, "Endpoint not found", 404);
});

app.use((err, req, res) => {
  handleErrorResponse(res, err.message || "Internal Server Error", 500);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

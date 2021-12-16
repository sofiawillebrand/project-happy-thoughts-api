import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = Promise;

const HappyThought = mongoose.model("HappyThought", {
  message: {
    type: String,
    required: true,
    minlength: 4,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/thoughts", async (req, res) => {
  const happyThoughts = await HappyThought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(tasks);
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const happyThought = await new HappyThought({
      message,
    }).save();
    res.status(201).json(happyThought);
  } catch (error) {
    res.status(400).json({
      message: "Could not save happy thought to database",
      error: error.errors,
    });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

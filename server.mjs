import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resume.js"; // Ensure the path includes .js
import userRoutes from "./routes/user.js";     // Ensure the path includes .js

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/resumes', resumeRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/resume_builder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

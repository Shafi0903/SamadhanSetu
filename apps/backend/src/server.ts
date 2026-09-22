import dotenv from "dotenv";
import { createApp } from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 SamadhanSetu Backend Server running on http://localhost:${PORT}`);
});

import cors from "cors";
import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		optionsSuccessStatus: 200,
	}),
);

app.use(express.urlencoded({ extended: true }));
app.use(userRoutes);

export default app;

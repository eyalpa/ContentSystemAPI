import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import MongoDBConnector from "./dal/MongoDBConnector";
import postRoutes from "./api/routes/postRoutes";
import userRoutes from "./api/routes/userRoutes";
import authRoutes from "./api/routes/authRoutes";
import communityRoutes from "./api/routes/communityRoutes";

import { authMiddleware } from "./api/middleware/authMiddleware";

const app: Application = express();

// Initialize the MongoDB connector
const dbConnector = MongoDBConnector.getInstance();
app.use(cors({
  methods:["GET","POST","PATCH"],
  allowedHeaders: ["Content-Type","Authorization"]
}))
// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/auth", authRoutes);
app.use(authMiddleware);
app.use("/api/users", userRoutes);

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/community", communityRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Content System Server is running!");
});

app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.message);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

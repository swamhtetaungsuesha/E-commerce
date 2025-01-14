import express from "express";
import prisma from "./utils/prisma";
import authRoute from "./routes/authRoute";
import root from "./routes/root";
import productRoute from "./routes/productRoute";
import customerRoute from "./routes/customerRoute";
import serviceRoute from "./routes/serviceRoute";
import notFound from "./routes/notFound";
import errorHandler from "./middleware/errorHandler";
import { verifyToken } from "./middleware/authHandler";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const router = express.Router({ mergeParams: true });

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your client's origin
  credentials: true, // Allow cookies to be sent with requests
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/", root);
app.use("/auth", authRoute);

router.use("/services", serviceRoute);
router.use(verifyToken);
router.use("/products", productRoute);
router.use("/customers", customerRoute);

app.use("/api", router);
app.use("*", notFound);

app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server is running at port -> ${PORT}`)
);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

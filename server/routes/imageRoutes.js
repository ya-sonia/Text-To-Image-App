import express from "express";
import { generateImage, myImages } from "../controllers/imageController.js";
import userAuth from "../middleware/auth.js";

const imageRouter = express.Router();

imageRouter.post("/generate", userAuth, generateImage);
imageRouter.get("/my-images", userAuth, myImages);

export default imageRouter;

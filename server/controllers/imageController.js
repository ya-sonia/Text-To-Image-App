import axios from "axios";
import fs from "fs";
import userModel from "../models/userModel.js";
import shortid from "shortid";

const myImages = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, generations: user.generations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credits left. Buy credits to continue.",
        creditBalance: user.creditBalance,
      });
    }

    const form = new FormData();
    form.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      form,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    const fileName = `${shortid.generate()}.png`;
    const imagePath = `images/${fileName}`;

    fs.writeFileSync(imagePath, response.data);

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        creditBalance: user.creditBalance - 1,
        $push: {
          generations: {
            $each: [{ prompt, imageUrl: `/images/${fileName}` }],
            $position: 0, 
            $slice: 24,   
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Image generated",
      creditBalance: updatedUser.creditBalance,
      resultImage,
      imageUrl: `/images/${fileName}`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { generateImage, myImages };

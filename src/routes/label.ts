import express = require("express");
import { LabelService } from "../services/label-service";
import { verifyToken } from "../auth/googleOAuth2";

export const labelRouter = express.Router();
const labelService = new LabelService();

labelRouter.get("/", async (req, res) => {
  try {
    const authToken = req.cookies.auth_token; 
    const userId = await verifyToken(authToken);
    const labels = await labelService.findAll(userId);
    res.status(200).send(labels);
  } catch (err) {
    console.log(err);
  }
});

labelRouter.post("/", async (req, res) => {
  try {
    const labelName = req.body.name;
    const label = await labelService.save(labelName);
    res.status(200).send(label);
  } catch (err) {
    console.log(err);
  }
});

labelRouter.delete("/:labelId", async (req, res) => {
  try {
    const message = await labelService
      .delete(req.params.labelId)
      .then(() => "Deleted Successfully!");
    res.status(200).send(message);
  } catch (err) {
    console.log("Deletion Failed");
  }
});

labelRouter.put("/:labelId", async (req, res) => {
  try {
    const newLabel = req.body;
    const label = await labelService.update(req.params.labelId, newLabel);
    res.status(200).send(label);
  } catch (err) {
    console.log("Update operation failed", err);
  }
});

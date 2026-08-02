import express from "express";
import { getAllTransactionsModel } from "../models/transactionModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const data = await getAllTransactionsModel();

    res.status(200).json(
      new ApiResponse(200, "Transactions fetched successfully", data)
    );
  })
);

export default router;

import express from "express";
import { fetchInventory, createInventory, editInventory, removeInventory } from "../controllers/inventoryController.js";

const router = express.Router();

// GET all items
router.get("/", fetchInventory);

// POST new item
router.post("/", createInventory);

// PUT update item
router.put("/:id", editInventory);

// DELETE item
router.delete("/:id", removeInventory);

export default router;

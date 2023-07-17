const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orders");

router.post("/", createOrder);
router.get("/:id", getOneOrder);
router.get("/", getAllOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
const express = require ("express");
const router = express.Router();

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require("../controller/cartController");

const {protect} = require("../middleware/auth");

// This line applies "protect" to EVERY route defined below it in this file.
// So all cart routes require a valid JWT — exactly what the brief asks for.

router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeFromCart);
router.delete("/", clearCart);


module.exports = router;
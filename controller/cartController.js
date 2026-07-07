const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @route   GET /cart
// @desc    Get the logged-in user's cart, with product details populated

const getCart = async (req,res) => {
    try{
         const cartItems = await Cart.find({user: req.user._id}).populate(
            "product",
            "name price description stock imageUrl"
         );

         res.status(200).json({
            success: true,
            count: cartItems.length,
            data: cartItems,
         });
    } catch (error){
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
            error: error.message,
        });
    }
};


// @route   POST /cart
// @desc    Add a product to the logged-in user's cart.
//          If it's already there, increase the quantity instead
//          of creating a duplicate row.

const addToCart = async (req,res) => {
    try{
        const{productId , quantity = 1} = req.body;
        if(!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        } 

        const product = await Product.findById(productId);
        if(!product){
            return res.status(400).json({
                success: false,
                message: "Product not found, cannot add to cart",
            });
        } 

        if(product.stock<quantity){
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for "${product.name}" . Available:${product.stock}`,
            });
        }   
        let cartItem = await Cart.findOne({user: req.user._id, product: productId});
        if(cartItem){
            cartItem.quantity += Number(quantity);
            await cartItem.save();  
        } else{
            cartItem = await Cart.create({
                user: req.user._id,
                product: productId,
                quantity,
            });
        }
        cartItem = await cartItem.populate("product", "name price description stock imageUrl");

        res.status(201).json({
            success: true,
            message:"Product added to cart",
            data: cartItem,
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
            error: error.message,
        });
    }
};

// @route   PUT /cart/:id
// @desc    Update the quantity of a specific cart item.

const updateCartItem = async (req,res) =>{
    try{
        const {id} = req.params;
        const {quantity} = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid cart item ID format",
            });
        }
    
    const cartItem = await Cart.findOne({_id:id, user:req.user._id});
    if(!cartItem){
        return res.status(404).json({
            success: false,
            message: "Cart item not found",
        });
    }  
     const product = await Product.findById(cartItem.product);
    if (product && quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
      });
    }
    cartItem.quantity = quantity;
    await cartItem.save();  

    const updated = await cartItem.populate("product", "name price description stock imageUrl");
    res.status(200).json({
        success:true,
        message:"Cart item updated",
        data:updated,
    });
 } catch(error){
    res.status(500).json({
        success: false,
        message:"Failed to update cart item",
        error: error.message,
    });
 }
};

// @route  DELETE /cart/:id
// @desc   Remove a specified item from the cart.
const removeFromCart = async (req,res) => {
    try{
        const{id} = req.params;                                                             

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message:"Invalid cart item ID format",
            });
        }
        const cartItem  = await Cart.findOneAndDelete({_id:id, user: req.user._id});
        if(!cartItem){
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cartItem,
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: "Failed to remove cart item",
            error: error.message,
        });
    }
};

// @route  DELETE /cart
// @desc   Clear the ENTIRE cart for the logged-in user (used after an order is placed)
const clearCart = async (req, res) => {
    try {
        await Cart.deleteMany({ user: req.user._id });
        res.status(200).json({
            success: true,
            message: "Cart cleared",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: error.message,
        });
    }
};

module.exports = {getCart, addToCart, updateCartItem, removeFromCart, clearCart};
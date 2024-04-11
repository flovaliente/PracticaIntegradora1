import { Router } from 'express';
//import CartManagerFS from '../clases/CartManagerFS.js';
//import ProductManagerFS from '../clases/ProductManagerFS.js';
import CartManagerDB from '../dao/CartManagerDB.js';
import ProductManagerDB from '../dao/ProductManagerDB.js';


const router = Router();
const cartManager = new CartManagerDB();
const productManager = new ProductManagerDB();

// Create carts
router.post('/', async (req, res) => {
    try{
        const carts = await cartManager.createCart();
        res.status(200).send({
            status: 'success',
            payload: carts
        });
    }catch (error){
        res.status(400).send({
            status: 'error',
            message: error.message});
    }
});

// Get cart
router.get('/:cid', async (req, res) => {
    try{
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid, true);
        console.log(cart);
        res.status(200).send({
            status: 'success',
            payload: cart
        });
    }catch (error){
        res.status(error.statusCode || 500).send({
            status: 'error',
            message: error.message
        });
    }
});

// Add product to cart
router.post('/:cid/product/:pid', async (req, res) => {
    try{
        const { cid, pid } = req.params;
        
        // Me fijo si exite el carrito
        const cart = await cartManager.getCartById(parseInt(cid));
        if(!cart){
            res.status(404).json({error: 'Cart not found.'});
            return;
        }
    
        await cartManager.updateCart(cid, pid);
        res.status(200).json({status:'Producto añadido al carrito correctamente'});
    }catch (error){
        res.status(400).json({error: error.message});
    }
    
})

export default router;
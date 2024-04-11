import cartModel from './models/cartModel.js';

class CartManagerDB {
    
    async createCart(){
        try {
            const result = await cartModel.create();
            console.log(`Cart created successfully.`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error creating cart.`);
        }
    }

    async addToCart(cid, pid, quantity){
        const cart = await cartModel.findOne({ _id: cid });//Obtengo el carrito con id cid
        if(!cart){
            throw new Error(`The cart with id: ${cid} do not exist 😩`);
        }
        //console.log('Cart:', cart);
        const productFind = cart.products.find( (cartProduct) => String(cartProduct.productId) === String(pid) );
        if(productFind){//Chequeo que exista o no el producto en el carrito
            productFind.quantity += quantity; //Si el producto existe en el carrito, le incremento la cantidad quantity
        }else{
            cart.products.push( { productId: pid, quantity: quantity }); //Si no existe, lo agrego con la cantidad quantity
        }
        await cart.save(); //Guardo el carrito
    }

    async getCarts(){
        try {
            return await cartModel.find().populate('products.productId'); //con populate me va a traer toda la info del producto
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error trying to find carts.`);
        }
    }

    async getCartById(cid, populate = false){
        try {
            const cart = await cartModel.findOne({ _id: cid });
        
            if(populate)
                return await cart.populate('products.productId');

            return cart;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Cart with id: ${cid} do not exist.`);
        }
        
    }

    async updateCart(cid, pid){
        
    }

    async updateQuantityCart(cid, pid){
        
    }

    async deleteCart(cid){
        try {
            const result = await cartModel.deleteOne({ _id: cid })

            if(result.deletedCount === 0){
                throw new Error(`Cart with id: ${cid} do not exist.`);
            }else{
              console.log(`Cart with id: ${cid} deleted successfully.`);  
            }

            return result;
        } catch (error) {
            console.log(error.message);
            throw new Error(`Error deleting cart ${cid}.`);
        }
        

    }
}

export default CartManagerDB;
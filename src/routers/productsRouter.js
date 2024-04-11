import { Router } from 'express';
//import ProductManagerFS from '../clases/ProductManagerFS.js';
import ProductManagerDB from '../dao/ProductManagerDB.js';
import { uploader } from '../utils/multerUtil.js';

const productsRouter = Router();

const productManager = new ProductManagerDB();

// -Get products
productsRouter.get('/', async (req, res) =>{
    try {
        const products = await productManager.getProducts();
        const { limit } = req.query;
        if(!limit)
            res.status(200).send({
                status: 'success',
                payload: products
            });
        else
            res.status(200).send({
                status: 'success',
                payload: products.slice(0, parseInt(limit))
            });
    } catch (error) {
        res.status(500).send('Internal server error.');
    }
    
});

// -Get product by id
productsRouter.get('/:pid', async (req, res) =>{ 
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        res.status(200).send({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
});

// -Add product
productsRouter.post('/', uploader.array('thumbnails', 3), async (req, res) => {
    if(req.files){
        req.body.thumbnails = [];
        req.files.forEach( (file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await productManager.addProduct(req.body);
        
        res.status(200).send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// -Update product
productsRouter.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {
    if(req.files){
        req.body.thumbnails = [];
        req.files.forEach( (file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try{
        const { pid } = req.params;
        const updated = await productManager.updateProduct(pid, req.body);
        res.status(200).send({
            status: 'success',
            payload: updated
        });
    } catch(error){
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// -Delete product
productsRouter.delete('/:pid', async (req, res) => {
    try{
        const { pid } = req.params;
        await productManager.deleteProduct(pid);
        res.status(200).send({
            status: 'Product successfully deleted.'});
    }catch (error){
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
});

export default productsRouter;
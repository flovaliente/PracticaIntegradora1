import { Router } from 'express';
//import ProductManagerFS from '../clases/ProductManagerFS.js';
import ProductManagerDB from '../dao/ProductManagerDB.js';

const productManager = new ProductManagerDB();

const router = Router();

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', {products});
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', {products});
});

router.get('/message', async (req, res) => {

  res.render('message');
});

export default router;
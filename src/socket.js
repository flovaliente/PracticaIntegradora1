import { Server } from 'socket.io';
import ProductManagerDB from './dao/ProductManagerDB.js';

let io;
const productManager = new ProductManagerDB();

export const init = (httpServer) =>{
    io = new Server(httpServer);
    const messages = [];
    io.on('connection', async (socketClient) =>{
        console.log(`Nuevo cliente conectado con id: ${socketClient.id}`);
        
        socketClient.on("message", data =>{
            //console.log(`Mensaje: ${data.message}`);
            messages.push(data);

            io.emit("messagesLogs", messages);
        });

        socketClient.on("userConnect", data =>{
            socketClient.emit("messagesLogs", messages); //Para que cuando se conecte el usuario le aparezcan todos los mensajes
            socketClient.broadcast.emit("newUser", data); //Emito evento a todos los demas usuarios de que un nuevo usuario de conecto
        });
        
        let products = await productManager.getProducts();
        socketClient.emit('listaProductos', products);

        socketClient.on('addProduct', async (newProduct) =>{
            await productManager.addProduct(newProduct);
            let products = await productManager.getProducts();
            io.emit('listaProductos', products);
        });

        socketClient.on('deleteProductById', async (idDelete) =>{
            await productManager.deleteProduct(idDelete);
            let products = await productManager.getProducts();
            io.emit('listaProductos', products)
        })

        socketClient.on('disconnect', () =>{
            console.log(`Se ha desconectado el cliente con id ${socketClient.id}`);
        });
    });
    console.log('✅ Server socket running');
};
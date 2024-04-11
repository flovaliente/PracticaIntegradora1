import { getJSON, saveJSON } from "../utils.js";

class ProductManagerFS {
    constructor(){
        this.pathFile = "./src/products.json";
    }
    async addProduct(product){
        const { title, description, code, price, stock, category } = product;
        if(!title || !description || !code || !price || !stock || !category){
            throw new Error("Todos los campos son requeridos.");
        }
        const products = await getJSON(this.pathFile);
        if(this.isCodeInUse(products,code))
            throw new Error(`El codigo ${code} ya esta en uso`)
        
        const id = products.length + 1;
        const newProduct = {id, title, description, code, price,  stock, category};
        products.push(newProduct);
        await saveJSON(this.pathFile, products);
    }

    getProducts(){
        return getJSON(this.pathFile);
    }

    isCodeInUse(products ,code){ //funcion para ver si code ya se uso
        return products.some(product => product.code === code);
    }

    async getProductById(id){
        const products = await this.getProducts();
        const product = products.find(product => product.id === id);
        if(!product){
            console.warn(`No se encontro ningun producto con el id ${parseInt(id)}`);
        }else{return product} ;
    }

    async updateProduct(id, updatedProduct){
        const products = await this.getProducts();
        const position = products.findIndex(product => parseInt(product.id) === parseInt(id));
        if(position != -1){ // Si no se encontro un producto con el id recibido como parametro
            const updated = {...products[position], ...updatedProduct}; // lo que hace esto es si coincide algun campo, reemplaza los de la izq por los de la derecha
            products[position] = updated; // reemplazo por la actualizacion
            await saveJSON(this.pathFile, products);// guardo en el archivo json
            return products[position];
        }else{
            throw new Error(`No existe producto con id: ${id}`)
        }
    }

    async deleteProduct(id){
        console.log(id);
        const products = await this.getProducts();
        const position = products.findIndex(product => parseInt(product.id) === parseInt(id));
        //console.log(position);
        if(position != -1){
            products.splice(position, 1);// elimino el producto en la posicion
            await saveJSON(this.pathFile, products);
            return products;
        }else{
            throw new Error(`No existe producto con id: ${id}`)
        }
    }
}

export default ProductManagerFS;
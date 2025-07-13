const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Servir Bootstrap desde node_modules
app.use('/bootstrap.min.css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.min.css')));
app.use('/bootstrap.bundle.min.js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')));

// Leer productos desde el archivo JSON
function getProducts() {
  const data = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf-8');
  return JSON.parse(data);
}

// Ruta principal
app.get('/', (req, res) => {
  const products = getProducts();
  res.render('index', { products });
});

// Ruta de detalle de producto
app.get('/producto/:id', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }
  res.render('product', { product });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
}); 
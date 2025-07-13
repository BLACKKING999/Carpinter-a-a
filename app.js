const express = require("express")
const path = require("path")
const fs = require("fs")

const app = express()
const PORT = process.env.PORT || 3000

// Configuración de EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Middleware para parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")))

// Servir Bootstrap desde node_modules
app.use("/bootstrap.min.css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css/bootstrap.min.css")))
app.use(
  "/bootstrap.bundle.min.js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js")),
)

// Leer productos desde el archivo JSON con manejo de errores
function getProducts() {
  try {
    const filePath = path.join(__dirname, "products.json")
    console.log("Intentando leer archivo:", filePath)

    if (!fs.existsSync(filePath)) {
      console.error("El archivo products.json no existe en:", filePath)
      return []
    }

    const data = fs.readFileSync(filePath, "utf-8")
    console.log("Datos leídos:", data)

    const products = JSON.parse(data)
    console.log("Productos parseados:", products)

    return products
  } catch (error) {
    console.error("Error al leer products.json:", error)
    return []
  }
}

// Ruta principal
app.get("/", (req, res) => {
  try {
    const products = getProducts()
    console.log("=== DEBUG INFO ===")
    console.log("Productos encontrados:", products.length)
    console.log("Primer producto:", products[0])
    console.log("Tipo de products:", typeof products)
    console.log("Es array:", Array.isArray(products))

    res.render("index", {
      products: products,
      title: "Carpintería Profesional",
    })
  } catch (error) {
    console.error("Error en ruta principal:", error)
    res.render("index", {
      products: [],
      title: "Carpintería Profesional",
    })
  }
})

// Ruta de detalle de producto
app.get("/producto/:id", (req, res) => {
  try {
    const products = getProducts()
    const productId = Number.parseInt(req.params.id)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return res.status(404).render("error", {
        message: "Producto no encontrado",
        error: { status: 404 },
      })
    }

    res.render("product", { product })
  } catch (error) {
    console.error("Error en ruta de producto:", error)
    res.status(500).render("error", {
      message: "Error interno del servidor",
      error: { status: 500 },
    })
  }
})

// Ruta de error 404
app.use((req, res) => {
  res.status(404).render("error", {
    message: "Página no encontrada",
    error: { status: 404 },
  })
})

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).render("error", {
    message: "Error interno del servidor",
    error: { status: 500 },
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`)
  console.log("📁 Directorio actual:", __dirname)

  // Verificar que products.json existe
  const productsPath = path.join(__dirname, "products.json")
  if (fs.existsSync(productsPath)) {
    console.log("✅ products.json encontrado")
    const products = getProducts()
    console.log(`📦 ${products.length} productos cargados`)
  } else {
    console.log("❌ products.json NO encontrado en:", productsPath)
  }
})

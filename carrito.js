// Clase "molde" para los productos
class Producto {
  constructor(id, marca, nombre, precio, imagen) {
      this.id = id;
      this.marca = marca;
      this.nombre = nombre;
      this.precio = precio;
      this.imagen = imagen;
  }
}

// Clase simulando la base de datos del e-commerce
class BaseDeDatos {
  constructor() {
      // Array para el catálogo
      this.productos = [];
      // Los productos
      this.agregarRegistro(1, "Nike", "Air Max 90", 93, "AirMax90.jpg");
      this.agregarRegistro(2, "Nike", "Air Force 1", 72, "AirForce1.jpg");
      this.agregarRegistro(3, "Adidas", "Forum", 49, "Forum.jpg");
      this.agregarRegistro(4, "Adidas", "Campus", 75, "Campus.jpg");
      this.agregarRegistro(5, "Jordan", "Retro 1", 216, "Retro1.jpg");
      this.agregarRegistro(6, "Jordan", "Retro 4", 212, "Retro4.jpg");
      this.agregarRegistro(7, "Yeezy", "350", 186, "350.jpg");
      this.agregarRegistro(8, "Yeezy", "700", 175, "700.jpg");
  }

// Creo el objeto producto y lo guardo en el catalogo 
agregarRegistro(id, marca, nombre, precio, imagen) {
  const producto = new Producto(id, marca, nombre, precio, imagen);
  this.productos.push(producto);
  }

// Devuelve todo el catálogo de productos
traerRegistros() {
  return this.productos;
  }

// Nos devuelve un producto según el ID
registroPorId(id) {
  return this.productos.find((producto) => producto.id === id);
  }

// Nos devuelve un array con todas las coincidencias que encuentre según el nombre y marca del producto con la palabra que el pasemos como parámetro
registrosPorNombre(palabra) {
  return this.productos.filter((producto) =>
  producto.nombre.toLowerCase().includes(palabra.toLowerCase()) || producto.marca.toLowerCase().includes(palabra.toLowerCase()));
  }
}

// Clase carrito para manipular los productos de nuestro carrito
class Carrito {
  constructor() {
      // Storage
      const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
      // Array donde van a estar almacenados todos los productos del carrito
      this.carrito = carritoStorage || [];
      this.total = 0; // Suma total de los precios de todos los productos
      this.cantidadProductos = 0; // La cantidad de productos que tenemos en el carrito
      this.listar();
  }

// Método para saber si el producto ya se encuentra en el carrito
estaEnCarrito({ id }) {
  return this.carrito.find((producto) => producto.id === id);
  }

// Agregar al carrito
agregar(producto) {
  const productoEnCarrito = this.estaEnCarrito(producto);
  // Si no está en el carrito, le mando un push y le agrego la propiedad "cantidad"
  if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
  } else {
    // De lo contrario, le sumo en 1 la cantidad
      productoEnCarrito.cantidad++;
  }
  localStorage.setItem("carrito", JSON.stringify(this.carrito));
  this.listar();
  }

// Quitar del carrito
quitar(id) {
  // Obento el índice de un producto
  const indice = this.carrito.findIndex((producto) => producto.id === id);
  // Si la cantidad es mayor a 1, le resto la cantidad en 1
  if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
  } else {
    // Sino, borramos del carrito el producto a quitar
      this.carrito.splice(indice, 1);
  }
  // Actualizo el storage
  localStorage.setItem("carrito", JSON.stringify(this.carrito));
  // Muestro los productos en el HTML
  this.listar();
  }

// Renderiza todos los productos en el HTML
listar() {
  // Reiniciamos variables
  this.total = 0;
  this.cantidadProductos = 0;
  divCarrito.innerHTML = "";
  // Recorro producto por producto del carrito, y los muestro en el HTML
  for (const producto of this.carrito) {
      divCarrito.innerHTML += `
          <div class="productoCarrito">
              <div class="imagen">
                <img src="images/${producto.imagen}" />
              </div>
              <h2>${producto.marca}</h2>
              <h2>${producto.nombre}</h2>
              <p>$${producto.precio}</p>
              <p>Cantidad: ${producto.cantidad}</p>
              <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
          </div>
      `;
    // Actualizamos los totales
  this.total += producto.precio * producto.cantidad;
  this.cantidadProductos += producto.cantidad;
  }

  // Lista de todos los botones con .querySelectorAll
  const botonesQuitar = document.querySelectorAll(".btnQuitar");
  // Después los recorro uno por uno y les asigno el evento a cada uno
  for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idProducto = Number(boton.dataset.id);
      this.quitar(idProducto);
      });
  }
  // Actualizo los contadores del HTML
  spanCantidadProductos.innerText = this.cantidadProductos;
  spanTotalCarrito.innerText = this.total;
  }
}

// Instanciamos la base de datos
const bd = new BaseDeDatos();

// Elementos
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("#ocultar");

// Instaciamos la clase Carrito
const carrito = new Carrito();

// Mostramos el catálogo de la base de datos apenas carga la página
cargarProductos(bd.traerRegistros());

// Función para renderizar productos del catálogo o buscador
function cargarProductos(productos) {
// Vacíamos el div
  divProductos.innerHTML = "";
// Recorremos producto por producto y lo dibujamos en el HTML
  for (const producto of productos) {
      divProductos.innerHTML += `
          <div class="producto">
            <div class="imagen">
              <img src="images/${producto.imagen}" />
            </div>
            <h2>${producto.marca}</h2>
            <h2>${producto.nombre}</h2>
            <p class="precio">$${producto.precio}</p>
          <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
          </div>
  `;
  }

// Lista dinámica con todos los botones que haya en nuestro catálogo
const botonesAgregar = document.querySelectorAll(".btnAgregar");

// Recorremos botón por botón de cada producto en el catálogo y le agregamos
// el evento click a cada uno
for (const boton of botonesAgregar) {
  boton.addEventListener("click", (event) => {
    // Evita el comportamiento default de HTML
      event.preventDefault();
    // Guardo el dataset ID que está en el HTML del botón Agregar al carrito
      const idProducto = Number(boton.dataset.id);
    // Uso el método de la base de datos para ubicar el producto según el ID
      const producto = bd.registroPorId(idProducto);
    // Llama al método agregar del carrito
      carrito.agregar(producto);
      });
  }
}

// Buscador
inputBuscar.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  const productos = bd.registrosPorNombre(palabra);
  cargarProductos(productos);
});


// Toggle para ocultar/mostrar el carrito
botonCarrito.addEventListener("click", (event) => {
  document.querySelector("section").classList.toggle("ocultar");
});

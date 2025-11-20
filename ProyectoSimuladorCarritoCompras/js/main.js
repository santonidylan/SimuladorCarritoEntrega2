// --- Entrega N°2: Código corregido según buenas prácticas ---

// 1. Definir array de objetos (Productos)
const productos = [
    { id: 1, nombre: "Laptop Gamer", precio: 1500, imagen: "💻" },
    { id: 2, nombre: "Mouse Óptico", precio: 40, imagen: "🖱️" },
    { id: 3, nombre: "Teclado Mecánico", precio: 120, imagen: "⌨️" },
    { id: 4, nombre: "Monitor Curvo", precio: 350, imagen: "🖥️" },
    { id: 5, nombre: "Auriculares RGB", precio: 80, imagen: "🎧" }
];

// 2. Inicializar carrito con Storage (Operador OR para evitar null)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Referencias globales al DOM (elementos estáticos)
const contenedorProductos = document.getElementById("cards-container");
const contenedorCarrito = document.getElementById("carrito-lista");
const precioTotalElemento = document.getElementById("precio-total");
const botonVaciar = document.getElementById("btn-vaciar");


// --- Funciones ---

/**
 * Función para imprimir los productos en el HTML.
 * Genera botones con IDs dinámicos para asignar eventos correctamente.
 */
function imprimirProductosEnHTML() {
    // Limpiamos contenedor por seguridad
    contenedorProductos.innerHTML = "";

    // Recorremos el array
    for (const producto of productos) {
        const col = document.createElement("div");
        col.classList.add("col-md-6", "col-lg-4");

        // Creamos el contenido HTML interno
        // Generamos un ID único para el botón: btn-agregar-1, btn-agregar-2, etc.
        col.innerHTML = `
            <div class="card card-producto h-100 mb-3 shadow-sm">
                <div class="card-body text-center">
                    <div style="font-size: 3rem;">${producto.imagen}</div>
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio}</p>
                    <button id="btn-agregar-${producto.id}" class="btn btn-primary">Comprar</button>
                </div>
            </div>
        `;

        // Agregamos la card al DOM
        contenedorProductos.appendChild(col);

        // AHORA capturamos el botón recién creado del DOM
        const boton = document.getElementById(`btn-agregar-${producto.id}`);

        // Asignamos el evento click
        boton.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });
    }
}

/**
 * Función para agregar producto al array y actualizar storage
 */
function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarStorage();
    imprimirCarritoEnHTML();
}

/**
 * Función para imprimir el carrito.
 * También genera botones de eliminar dinámicamente.
 */
function imprimirCarritoEnHTML() {
    contenedorCarrito.innerHTML = "";

    // Usamos forEach con índice para poder eliminar elementos específicos
    carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        
        // Generamos ID único para el botón eliminar basado en el índice del array
        li.innerHTML = `
            <span>${producto.nombre} - $${producto.precio}</span>
            <button id="btn-eliminar-${index}" class="btn btn-sm btn-danger">X</button>
        `;

        contenedorCarrito.appendChild(li);

        // Capturamos el botón de eliminar recién creado
        const botonEliminar = document.getElementById(`btn-eliminar-${index}`);
        
        botonEliminar.addEventListener("click", () => {
            eliminarDelCarrito(index);
        });
    });

    calcularTotal();
}

/**
 * Elimina un producto por su índice en el array
 */
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarStorage();
    imprimirCarritoEnHTML();
}

/**
 * Guarda el estado actual del carrito en LocalStorage
 */
function actualizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

/**
 * Calcula el precio total y actualiza el DOM
 */
function calcularTotal() {
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    precioTotalElemento.innerText = `$${total}`;
}


// --- Eventos Globales ---

// Evento para vaciar carrito
botonVaciar.addEventListener("click", () => {
    carrito = [];
    actualizarStorage();
    imprimirCarritoEnHTML();
});


// --- Ejecución Inicial ---

// Renderizamos productos disponibles
imprimirProductosEnHTML();

// Si hay algo en el carrito recuperado del storage, lo mostramos
if (carrito.length > 0) {
    imprimirCarritoEnHTML();
}
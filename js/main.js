// --- Proyecto Final: E-commerce con JSON, Fetch y Librerías ---

// Variables globales
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = []; // Se llenará con el fetch

// Referencias al DOM
const contenedorProductos = document.getElementById("cards-container");
const contenedorCarrito = document.getElementById("carrito-lista");
const precioTotalElemento = document.getElementById("precio-total");
const botonVaciar = document.getElementById("btn-vaciar");
const botonComprar = document.getElementById("btn-comprar");
const loaderTexto = document.getElementById("loader-texto");

// --- Lógica de Negocio y Funciones ---

/**
 * Función asíncrona para cargar productos desde JSON local
 *  Carga de datos remotos/simulados de forma asíncrona
 */
async function cargarProductos() {
    try {
        const respuesta = await fetch("productos.json");
        const data = await respuesta.json();
        productos = data;
        imprimirProductosEnHTML(productos);
        loaderTexto.style.display = "none"; // Ocultamos el mensaje de carga
    } catch (error) {
        //  Manejo de error visual con librería
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los productos. Intenta más tarde.'
        });
    }
}

/**
 * Renderiza las tarjetas de productos en el HTML
 */
function imprimirProductosEnHTML(listaProductos) {
    contenedorProductos.innerHTML = "";

    listaProductos.forEach(producto => {
        const col = document.createElement("div");
        col.classList.add("col-md-6", "col-lg-4");

        col.innerHTML = `
            <div class="card card-producto h-100 mb-3 shadow-sm">
                <div class="card-body text-center">
                    <div style="font-size: 3rem;">${producto.imagen}</div>
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio}</p>
                    <button id="btn-agregar-${producto.id}" class="btn btn-primary">Agregar</button>
                </div>
            </div>
        `;
        contenedorProductos.appendChild(col);

        // Asignación de evento
        const boton = document.getElementById(`btn-agregar-${producto.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(producto));
    });
}

/**
 * Agrega un producto al carrito y muestra notificación
 */
function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarStorage();
    imprimirCarritoEnHTML();

    //  Librería Toastify para feedback no intrusivo
    Toastify({
        text: `Agregaste ${producto.nombre}`,
        duration: 3000,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}

/**
 * Renderiza la lista del carrito visualmente
 */
function imprimirCarritoEnHTML() {
    contenedorCarrito.innerHTML = "";

    carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        
        li.innerHTML = `
            <span>${producto.nombre} - $${producto.precio}</span>
            <button id="btn-eliminar-${index}" class="btn btn-sm btn-danger">X</button>
        `;
        contenedorCarrito.appendChild(li);

        const botonEliminar = document.getElementById(`btn-eliminar-${index}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(index));
    });

    calcularTotal();
}

/**
 * Elimina un ítem del carrito
 */
function eliminarDelCarrito(index) {
    //  Toastify para feedback de eliminación
    Toastify({
        text: `Eliminado: ${carrito[index].nombre}`,
        duration: 2000,
        style: {
            background: "#ff5f6d",
        }
    }).showToast();

    carrito.splice(index, 1);
    actualizarStorage();
    imprimirCarritoEnHTML();
}

/**
 * Calcula el total y lo muestra
 */
function calcularTotal() {
    // [cite: 27] Recorrido óptimo de colecciones
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    precioTotalElemento.innerText = `$${total}`;
}

/**
 * Actualiza el LocalStorage
 */
function actualizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

/**
 * Función para finalizar compra (Simulación de flujo completo)
 *  Simula el proceso completo de compra y entrada-proceso-salida
 */
function finalizarCompra() {
    if (carrito.length === 0) {
        //  SweetAlert2 para advertencias
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Agrega productos antes de comprar.'
        });
        return;
    }

    //  SweetAlert2 para éxito
    Swal.fire({
        title: '¡Compra exitosa!',
        text: 'Gracias por tu compra. Te enviaremos el pedido pronto.',
        icon: 'success',
        confirmButtonText: 'Genial'
    });

    // Reseteamos el sistema
    carrito = [];
    actualizarStorage();
    imprimirCarritoEnHTML();
}

// --- Eventos Globales ---

botonVaciar.addEventListener("click", () => {
    if (carrito.length === 0) return;

    // Confirmación antes de vaciar con SweetAlert2
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se borrarán todos los productos del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            actualizarStorage();
            imprimirCarritoEnHTML();
            Swal.fire('¡Borrado!', 'Tu carrito está vacío.', 'success');
        }
    });
});

botonComprar.addEventListener("click", finalizarCompra);

// --- Inicialización ---

//  Inicialización asíncrona
cargarProductos();

// Chequear storage al inicio
if (carrito.length > 0) {
    imprimirCarritoEnHTML();
}
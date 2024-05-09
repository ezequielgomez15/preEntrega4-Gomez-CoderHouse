const listado = document.getElementById('listado')
const container = document.querySelector('.container-de-juegos')
const juegos = document.querySelectorAll('.juegos')
const ul = document.getElementById('listado')
const total = document.querySelector('.total')
let carrito =  []
let precioTotal = 0
const baseDeDatos =  '../js/data.json'
var mHeaders = new Headers({'Content-Type':'application/json'})

async function LlamarJuegos(){
    try{
        const resp = await fetch(baseDeDatos, {
            method: 'GET', 
            headers:mHeaders
          })
        const data = await resp.json()
        data.forEach(usuario => {
            const contenedor = document.createElement('div')
            contenedor.classList.add('juegos')
            const li = document.createElement('li')
            li.innerHTML = `
                <img src="${usuario.img}">
                <h3 class="tituloJuego">${usuario.titulo}</h3>
                <p>Precio: <span>${usuario.precio}</span></p>
                <button class="botonAgregar">COMPRAR</button>
                `
            contenedor.appendChild(li)
            container.appendChild(contenedor)
        });
        asignarEventosBotones();
    }catch{
        const h4 = document.createElement('li')
        h4.innerText = 'Ups! algo salio mal, intente de nuevo mas tarde'
        container.appendChild(h4)
    }finally{
        console.log('terminado el llamado')
    }
}

function asignarEventosBotones() {
    const botonAgregar = document.querySelectorAll('.botonAgregar')
    botonAgregar.forEach(boton => {
        boton.addEventListener('click', verJuego)
    })
}

LlamarJuegos()
cargarCarritoDesdeLocalStorage()

function verJuego(event){
    const juegoSeleccionado = event.target.parentElement
    informacionDelJuego(juegoSeleccionado)
}

function informacionDelJuego(juegoSeleccionado){
    const tituloElement = juegoSeleccionado.querySelector('h3')
    const precioElement = juegoSeleccionado.querySelector('p span')
    if (tituloElement && precioElement) {
        const juego = {
            titulo: tituloElement.textContent,
            precio: parseInt(precioElement.textContent),
        }
        carrito.push(juego)
        precioTotal += juego.precio
        cargarJuego()
        guardarCarritoEnLocalStorage();
    }
}

function cargarJuego(){
    ul.innerHTML= ''
    carrito.forEach(juego => {
        let li = `<li>Juego: ${juego.titulo} Precio: ${juego.precio}  <button class="borrar" onclick="eliminarProducto(this, ${juego.precio})">Eliminar</button></li>`
        ul.innerHTML += li
    })
    total.innerHTML = `<span class="total">TOTAL: ${precioTotal} <button onClick="comprar()" type="submit" class="btn btn-light">Comprar</button></span>`
}

function eliminarProducto(elemento, precio) {
    const index = carrito.findIndex(elemento => elemento.precio === precio)
    if (index !== -1) {
        carrito.splice(index, 1)
        elemento.parentElement.remove()
        precioTotal -= precio
        guardarCarritoEnLocalStorage()
        cargarJuego()
    }
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('precioTotal', precioTotal);
}

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito')
    const precioTotalGuardado = localStorage.getItem('precioTotal')
    if (carritoGuardado && precioTotalGuardado) {
        carrito = JSON.parse(carritoGuardado)
        precioTotal = parseInt(precioTotalGuardado)
        cargarJuego()
    }
}

function comprar(){
    carrito = []
    precioTotal = 0
    cargarJuego()
    guardarCarritoEnLocalStorage();
}

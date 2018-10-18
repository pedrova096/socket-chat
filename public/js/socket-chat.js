var socket = io();
var prms = new URLSearchParams(window.location.search);
if (!prms.has('nombre') || !prms.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y/o sala es necesario');
}
var usuario = {
    nombre: prms.get('nombre'),
    sala: prms.get('sala')
}
socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('EntradaChat', usuario, function(resp) {
        renderizarUsuarios(resp);
    });
});
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });
socket.on('crearMensaje', function(resp) {
    renderizarMensaje(resp);
});
socket.on('ListarPersonas', function(resp) {
    renderizarUsuarios(resp);
});

socket.on('MensajePrivado', function(resp) {
    console.log('Mensaje Privado: ', resp);
})
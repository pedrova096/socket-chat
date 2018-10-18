var prms = new URLSearchParams(window.location.search);
var sala = prms.get('sala');
var divUsuario = $('#divUsuarios');
var formEnviarMensaje = $('#formEnviarMensaje');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

//Funciones para renderizar usuarios
function renderizarUsuarios(personas) {
    console.log(personas);
    var html = '';
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + sala + '</span></a>';
    html += '</li>';
    for (let i = 0; i < personas.length; i++) {
        const per = personas[i];
        html += '<li>';
        html += '    <a data-id="' + per.id + '" href="javascript:void(0)"><img src="assets/images/users/' + (i + 1) + '.jpg" alt="user-img" class="img-circle"> <span>' + per.nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    divUsuario.html(html);
}

function renderizarMensaje(mensaje, me) {
    var html = '';
    var hora = new Date(mensaje.fecha).toISOString().substr(11, 5);
    var classMsj = 'info';
    if (mensaje.nombre == 'Administrador') {
        classMsj = 'danger';
    }
    if (mensaje.mensaje.toLowerCase().includes('script')) {
        mensaje.mensaje = '';
    }
    if (me) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre != 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + classMsj + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatbox.append(html);
    scrollBottom();
}

//Listener
divUsuario.on('click', 'a', function() {
    var id = $(this).data('id');
    console.log(id);
});
formEnviarMensaje.on('submit', function(e) {
    e.preventDefault();
    var msj = txtMensaje.val().trim();
    if (msj.length === 0)
        return;
    socket.emit('crearMensaje', {
        mensaje: msj,
        sala: sala
    }, function(resp) {
        renderizarMensaje(resp, true);
        txtMensaje.val('').focus();
    });
});

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
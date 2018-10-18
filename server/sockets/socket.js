const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');
let usuario = new Usuarios();
io.on('connection', (client) => {
    client.on('EntradaChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: 'El nombre y la sala es necesario'
            });
        }
        client.join(data.sala);
        usuario.addPersona(client.id, data.nombre, data.sala);
        let personasSala = usuario.getPersonasBySala(data.sala);
        client.broadcast.to(data.sala).emit('ListarPersonas', personasSala);
        callback(personasSala);
    });

    client.on('crearMensaje', (data) => {
        let persona = usuario.getPersonaById(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {
        let perBorrada = usuario.deletePersonaById(client.id);
        client.broadcast.to(perBorrada.sala).emit('MensajeServer', crearMensaje('Administrador', `${perBorrada.nombre} ha abandonado el chat`));
        client.broadcast.to(perBorrada.sala).emit('ListarPersonas', usuario.getPersonasBySala(perBorrada.sala));
    });
    //Mensaje Privado
    client.on('MensajePrivado', (data) => {
        let persona = usuario.getPersonaById(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.to).emit('MensajePrivado', mensaje);
    });

});
class Usuarios {
    constructor() {
        this.personas = []
    }
    addPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };
        this.personas.push(persona);
        return this.personas;
    }
    getPersonas() {
        return this.personas;
    }
    getPersonaById(id) {
        let persona = this.personas.filter(p => p.id === id)[0];
        return persona;
    }
    deletePersonaById(id) {
        let perBorrada = this.getPersonaById(id);
        this.personas = this.personas.filter(p => p.id != id);
        return perBorrada;
    }
    getPersonasBySala(sala) {
        let personasBySala = this.personas.filter(p => p.sala === sala);
        return personasBySala;
    }
}
module.exports = {
    Usuarios
}
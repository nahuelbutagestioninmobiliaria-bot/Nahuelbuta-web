/**
 * TRES PINOS PROJECT DATA
 * Isolated data for easy modification
 */

const TRES_PINOS_DATA = {
    name: "Proyecto Tres Pinos",
    location: "Los Álamos, Provincia de Arauco",
    description: "9 sitios exclusivos ubicados en la comuna de Los Álamos. Una oportunidad única de inversión con alta plusvalía y entorno natural privilegiado.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3181.49!2d-73.4113!3d-37.6299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzfCsDM3JzQ3LjgiUyA3M8KwMjQnNDAuOCJX!5e0!3m2!1ses-419!2scl!4v1712072000000!5m2!1ses-419!2scl",
    mapLink: "https://maps.app.goo.gl/4TJDJxCmQu44EcrS7",
    stats: {
        totalLots: 9,
        avgSurface: "~500 m²",
        services: "Electricidad y Agua",
        status: "Preventa"
    },
    lots: [
        { id: "1", surface: "445", rol: "299-9", address: "Psje Los Copihues N° 145", status: "Disponible" },
        { id: "2", surface: "482", rol: "299-10", address: "Psje Los Copihues N° 143", status: "Disponible" },
        { id: "3", surface: "482", rol: "299-11", address: "Psje Los Copihues N° 141", status: "Disponible" },
        { id: "11", surface: "436", rol: "299-19", address: "Psje Los Copihues N° 147", status: "Disponible" },
        { id: "12", surface: "454", rol: "299-20", address: "Psje Los Copihues N° 149", status: "Disponible" },
        { id: "13", surface: "440", rol: "299-21", address: "Psje Los Copihues N° 151", status: "Disponible" },
        { id: "31", surface: "583", rol: "299-39", address: "Psje Los Copihues N° 203", status: "Disponible" },
        { id: "32", surface: "570", rol: "299-40", address: "Psje Los Copihues N° 201", status: "Disponible" },
        { id: "33", surface: "560", rol: "299-41", address: "Psje Los Copihues N° 195", status: "Disponible" }
    ]
};

// Export to window for access by script.js
window.TRES_PINOS_DATA = TRES_PINOS_DATA;

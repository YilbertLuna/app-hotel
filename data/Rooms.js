export const Rooms = [
  {
    _id: 1,
    name: "Habitación Estándar",
    description: "Habitación cómoda con todas las comodidades básicas para una estancia agradable.",
    price: 100,
    images: [require('@/assets/images/habitaciones/habitacionStandar.png')],
    features: ["Cama doble", "Baño privado", "TV", "WiFi"],
    available: true,
  },
  {
    _id: 2,
    name: "Habitación Superior",
    description: "Habitación espaciosa con vistas y comodidades adicionales para una estancia superior.",
    price: 150,
    images: [require('@/assets/images/habitaciones/habitacionSuperior.png')],
    features: ["Cama king", "Baño de lujo", "TV", "WiFi", "Minibar"],
    available: true,
  },
  {
    _id: 3,
    name: "Suite Ejecutiva",
    description: "Suite de lujo con sala de estar separada y todas las comodidades premium.",
    price: 250,
    images: [require('@/assets/images/habitaciones/SuiteEjecutiva.png')],
    features: ["Cama king", "Sala de estar", "Jacuzzi", "TV", "WiFi", "Minibar", "Desayuno incluido"],
    available: true,
  },
];
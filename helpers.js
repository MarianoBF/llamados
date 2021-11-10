function generarLlamadas(cantidad) {
    let llamadas = [];
    for (let numLlamada = 0; numLlamada < cantidad; numLlamada++) {
      const id = numLlamada;
      const duracion = Math.floor(Math.random() * 20 + 1); // ajustar en función de length
      const hora = Math.floor(Math.random() * 24);
      const minutos = Math.floor(Math.random() * 60);
      const segundos = Math.floor(Math.random() * 60);
      const horaInicio = new Date(2020, 03, 17, 00, 00, segundos);
      llamada = { id: numLlamada, inicio: horaInicio, duracion: duracion };
      llamadas.push(llamada);
    }
    return llamadas;
  }
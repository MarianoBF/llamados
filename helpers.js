function generarLlamadas(cantidad) {
  let llamadas = [];
  let segundos = 0;
  for (let numLlamada = 0; numLlamada < cantidad; numLlamada++) {
    const id = numLlamada;
    const duracion = Math.floor(Math.random() * 60 + 1); // ajustar en función de length
    const hora = Math.floor(Math.random() * 24);
    const minutos = Math.floor(Math.random() * 60);
    segundos = segundos + Math.floor(Math.random() * 3) + 1;
    const horaInicio = new Date(2020, 03, 17, 00, 00, segundos);
    let llamada = { id: numLlamada, inicio: horaInicio, duracion: duracion };
    llamadas.push(llamada);
  }
  return llamadas;
}

function dibujarLlamada(llamada) {
  let detalleLlamada = document.createElement("p");
  detalleLlamada.id = "llamada" + llamada.id;
  detalleLlamada.innerText = `ID: ${llamada.id} Inicio: ${
    Number(llamada.inicio) / 1000
  } Duracion: ${llamada.duracion}`;
  return detalleLlamada;
}

function dibujarActiva(agregar, directo) {
  let detalleLlamadaAMover = document.createElement("p");
  detalleLlamadaAMover.id = "activa" + agregar.id;
  detalleLlamadaAMover.innerText = `ID: ${agregar.id} Inicio: ${
    agregar.inicio
  } Duración: ${agregar.fin - agregar.inicio} seg. ${
    directo ? "Entró directo" : "Estuvo en espera"
  }`;
  return detalleLlamadaAMover;
}

function dibujarPerdida(llamada) {
  let detalleLlamada = document.createElement("p");
  detalleLlamada.id = "llamada" + llamada.id;
  detalleLlamada.innerText = `ID: ${llamada.id} Inicio: ${
    Number(llamada.inicio) / 1000
  } Duracion: ${llamada.duracion} seg. Quedó perdida`;
  return detalleLlamada;
}

function dibujarEnEspera(enEspera) {
  let detalleLlamadaAMover = document.createElement("p");
  detalleLlamadaAMover.id = enEspera.id;
  detalleLlamadaAMover.innerText = `ID: ${enEspera.id} Inicio: ${enEspera.inicio}`;
  return detalleLlamadaAMover
}

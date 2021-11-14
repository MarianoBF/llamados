function generarLlamadas(cantidad, min, max) {
  let llamadas = [];
  let segundos = 0;
  for (let numLlamada = 0; numLlamada < cantidad; numLlamada++) {
    let duracion = Math.floor((Math.random() * 30) + +min);
    duracion > +max ? duracion = +max : null; 
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

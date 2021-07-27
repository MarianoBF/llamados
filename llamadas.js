const contenedorEnCurso = document.getElementById("contenedorLlamadasEnCurso");
const contenedoLlamadas = document.getElementById("contenedorLlamadas");
const contenedorEnEspera = document.getElementById(
  "contenedorLlamadasEnEspera"
);

let llamadas = [];

function generarLlamadas(cantidad) {
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
}

generarLlamadas(40);

for (let llamada of llamadas) {
  let detalleLlamada = document.createElement("p");
  detalleLlamada.id = "llamada"+llamada.id;
  detalleLlamada.innerText = `ID: ${llamada.id} Inicio: ${llamada.inicio} Duracion: ${llamada.duracion}`;
  contenedoLlamadas.append(detalleLlamada);
}

//Cuantos tiene el callcenter para que nadie espere más de 10 segundos? O de "x" segundos?

function calcularLlamadas(llamadas, operadores) {
  let personasHablando = 0;
  let operadoresDisponibles = new Array(operadores).fill(1);
  let maxOperadoresOcupados = 0;
  let esperaMax = 0;
  let llamadasEnCurso = [];
  let llamadasEnEspera = [];
  let llamadasOrdenadas = llamadas.sort((a, b) =>
    a.inicio >= b.inicio ? 1 : -1
  );
  let time = 1587092400;
  let length = time + 60; //ajustar

  for (time; time < length; time++) {
    const logLlamadas = llamadasEnCurso.map((item) => item.id);
    // console.log(time);
    // console.table([
    //   ["operadores disponibles", ...operadoresDisponibles],
    //   ["llamadas activas", ...logLlamadas],
    // ]);
    if (llamadasEnCurso.length > 0) {
      //1ro chequea si alguna llamada en curso se terminó
      llamadasEnCurso.forEach((llamada, i) => {
        if (llamada.fin <= time) {
          llamadasEnCurso.splice(i, 1);
          // console.log(
          //   document.getElementById(llamada.id),
          //   llamada.id,
          //   "terminó"
          // );
          document.getElementById("activa"+llamada.id).classList.add("llamadaTerminada");
          // console.log(llamadasEnCurso);
          operadoresDisponibles.push(1);
          // console.log(operadoresDisponibles);
          personasHablando--;
        }
      });
    }
    if (llamadasEnEspera.length > 0) {
      //2do si hay pendientes entra la llamada en espera
      if (operadoresDisponibles.indexOf(1) === -1) {
        llamadasEnEspera.forEach((item) => (item.espera += 1));
        // console.log(llamadasEnEspera);
      } else {
        // console.log(operadoresDisponibles, llamadasEnEspera)
        // console.log(operadoresDisponibles.indexOf(1), llamadasEnEspera.length)
        while (
          operadoresDisponibles.indexOf(1) !== -1 &&
          llamadasEnEspera.length >= 1
        ) {
          if (llamadasEnEspera.length > 0) {
            // console.log(llamadasEnEspera[0].espera, esperaMax);
            llamadasEnEspera[0].espera > esperaMax
              ? (esperaMax = llamadasEnEspera[0].espera)
              : null;

            let llamadaAMover = llamadasEnEspera.shift();
            llamadaAMover.fin = time + llamadaAMover.duracion;
            llamadasEnCurso.push(llamadaAMover);
            let detalleLlamadaAMover = document.createElement("p");
            detalleLlamadaAMover.id = "activa"+llamadaAMover.id;
            detalleLlamadaAMover.innerText = `ID: ${llamadaAMover.id} Inicio: ${llamadaAMover.inicio} Duración: ${llamadaAMover.fin} Espera: ${llamadaAMover.espera}`;
            contenedorEnCurso.append(detalleLlamadaAMover);
            operadoresDisponibles.pop();
            console.log("habilitar operador llamada en espera");
          }
        }
      }
    }

    llamadasOrdenadas.forEach((llamada, i) => {
      //3ro chequea si hay nuevas llamadas para entrar a en curso o en espera si no hay ops
      if (llamada.inicio.getTime() / 1000 === time) {
        llamadasOrdenadas.splice(i, 1);
        // console.log(llamada.inicio.getTime() / 1000, time);
        if (operadoresDisponibles.indexOf(1) !== -1) {
          console.log("habilitar operador nueva llamada");
          operadoresDisponibles.pop();
          const agregar = {
            id: llamada.id,
            inicio: time,
            fin: time + llamada.duracion,
          };
          llamadasEnCurso.push(agregar);
          let detalleLlamadaAMover = document.createElement("p");
          detalleLlamadaAMover.id = "activa"+agregar.id;
          detalleLlamadaAMover.innerText = `ID: ${agregar.id} Inicio: ${agregar.inicio} Duración: ${agregar.fin} Entró directo`;
          contenedorEnCurso.append(detalleLlamadaAMover);
          // console.log(llamadasEnCurso, operadoresDisponibles);
          personasHablando++;
          if (personasHablando > maxOperadoresOcupados) {
            maxOperadoresOcupados = personasHablando;
          }
        } else {
          const enEspera = {
            id: llamada.id,
            inicio: time,
            duracion: llamada.duracion,
            espera: 0,
          };
          let detalleLlamadaAMover = document.createElement("p");
          detalleLlamadaAMover.id = enEspera.id;
          detalleLlamadaAMover.innerText = `ID: ${enEspera.id} Inicio: ${enEspera.inicio}`;
          contenedorEnEspera.append(detalleLlamadaAMover);
          llamadasEnEspera.push(enEspera);
          console.log(
            "no hay operadores disponibles, poniendo llamada en espera"
          );
        }
      }
    });
  }

  return [maxOperadoresOcupados, esperaMax];
}

const opsDisp = 3;
let [ops, esp] = calcularLlamadas(llamadas, opsDisp);
console.log(
  "max ops simultáneos: ",
  ops,
  "max ops disponibles: ",
  opsDisp,
  "max tiempo de espera (segs): ",
  esp
);

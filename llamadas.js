let llamadas = [];

function generarLlamadas(cantidad) {
  for (let numLlamada = 0; numLlamada < cantidad; numLlamada++) {
    const id = numLlamada;
    const duracion = Math.floor(Math.random() * 20 + 1); // ajustar en función de length
    const hora = Math.floor(Math.random() * 24);
    const minutos = Math.floor(Math.random() * 60);
    const segundos = Math.floor(Math.random() * 60);
    const horaInicio = new Date(2020, 03, 17, 00, 00, segundos);
    llamada = {id: numLlamada, inicio: horaInicio, duracion: duracion};
    llamadas.push(llamada);
  }
}

generarLlamadas(40);

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
    const logLlamadas = llamadasEnCurso.map(item=>item.id)
    console.log(time)
    console.table([["operadores disponibles", ...operadoresDisponibles],["llamadas activas", ...logLlamadas]])
    if (llamadasEnCurso.length > 0) {
      //1ro chequea si alguna llamada en curso se terminó
      llamadasEnCurso.forEach((llamada, i) => {
        if (llamada.fin <= time) {
          llamadasEnCurso.splice(i, 1);
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
        llamadasEnEspera.forEach(item => (item.espera += 1));
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
            llamadasEnCurso.push(llamadasEnEspera.shift());
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
          // console.log(llamadasEnCurso, operadoresDisponibles);
          personasHablando++;
          if (personasHablando > maxOperadoresOcupados) {
            maxOperadoresOcupados = personasHablando;
          }
        } else {
          const enEspera = {
            id: llamada.id,
            inicio: time,
            fin: time + llamada.duracion,
            espera: 0,
          };
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
console.log("max ops simultáneos: ", ops, "max ops disponibles: ", opsDisp, "max tiempo de espera (segs): ", esp);

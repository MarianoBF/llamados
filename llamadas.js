const contenedorEnCurso = document.getElementById("contenedorLlamadasEnCurso");
const contenedorLlamadas = document.getElementById("contenedorLlamadas");
const contenedorEnEspera = document.getElementById(
  "contenedorLlamadasEnEspera"
);
const contenedorPerdidas = document.getElementById(
  "contenedorLlamadasPerdidas"
);
const cantOps = document.getElementById("cantOps");
const tEspera = document.getElementById("tEspera");
const tEsperaMax = document.getElementById("maxEspera");
const cantLlam = document.getElementById("cantLlam");

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", runLlamadas);

const esperaMaxDeseada = document.getElementById("maxEspera");
let radios = document.querySelectorAll("input[type=radio]");

radios.forEach((radio) =>
  radio.addEventListener("change", () => modeSelect(radio.value))
);

function modeSelect(value) {
  startButton.removeEventListener("click", runLlamadas);
  value === "radioQoperadores"
    ? startButton.addEventListener("click", runLlamadas) && startButton.removeEventListener("click", testing)
    : startButton.addEventListener("click", testing) && startButton.removeEventListener("click", runLlamadas);
}

function runLlamadas() {
  const cantLlamadas = +document.getElementById("cantLlamadas").value;
  const minDuracion = +document.getElementById("minDuracion").value;
  const maxDuracion = +document.getElementById("maxDuracion").value;

  const cantOperadores = +document.getElementById("cantOperadores").value;
  const plazo = +document.getElementById("segundosPlazo").value;

  contenedorEnCurso.innerHTML = "";
  contenedorEnEspera.innerHTML = "";
  contenedorLlamadas.innerHTML = "";
  contenedorPerdidas.innerHTML = "";

  let llamadas = generarLlamadas(cantLlamadas, minDuracion, maxDuracion);

  for (let llamada of llamadas) {
    contenedorLlamadas.append(dibujarLlamada(llamada));
  }

  let [ops, esp, atend, perd] = calcularLlamadas(
    llamadas,
    cantOperadores,
    plazo
  );

  cantOps.innerText = ops + " de " + cantOperadores;
  tEspera.innerText = esp + " segundos";
  tEsperaMax.value = esp;
  cantLlam.innerText = cantLlamadas + " / " + atend + " / " + perd;

  console.log(
    "max ops simultáneos: ",
    ops,
    "max ops disponibles: ",
    cantOperadores,
    "max tiempo de espera (segs): ",
    esp
  );
}

//Cuantos tiene el callcenter para que nadie espere más de 10 segundos? O de "x" segundos?
let cantOperadoresTest = 5

function testing () {

  console.log("with q operadores", cantOperadoresTest)
  let llamadas = [];

  const cantLlamadas = +document.getElementById("cantLlamadas").value;
  const minDuracion = +document.getElementById("minDuracion").value;
  const maxDuracion = +document.getElementById("maxDuracion").value;

  const plazo = +document.getElementById("segundosPlazo").value;

  contenedorEnCurso.innerHTML = "";
  contenedorEnEspera.innerHTML = "";
  contenedorLlamadas.innerHTML = "";
  contenedorPerdidas.innerHTML = "";

  llamadas = generarLlamadas(cantLlamadas, minDuracion, maxDuracion);

  for (let llamada of llamadas) {
    contenedorLlamadas.append(dibujarLlamada(llamada));
  }

  let [ops, esp, atend, perd] = calcularLlamadas(
    llamadas,
    cantOperadoresTest,
    plazo
  );

  cantOps.innerText = ops + " de " + cantOperadoresTest;
  tEspera.innerText = esp + " segundos";
  tEsperaMax.value = esp;
  cantLlam.innerText = cantLlamadas + " / " + atend + " / " + perd;

  console.log("esperaMax", esp, esperaMaxDeseada.value)

  if (esp > esperaMaxDeseada.value) {
    cantOperadoresTest--
    testing()
  }
}

function calcularLlamadas(llamadas, operadores, plazo) {
  console.log("inputs calcular llamadas: ", llamadas, operadores, plazo);
  let personasHablando = 0;
  let operadoresDisponibles = new Array(+operadores).fill(1);
  console.log("ops", operadoresDisponibles);
  let maxOperadoresOcupados = 0;
  let esperaMax = 0;
  let contador = 0;
  let llamadasEnCursoContador = 0;
  let llamadasEnEsperaContador = 0;
  let llamadasEnCurso = [];
  let llamadasEnEspera = [];
  let llamadasOrdenadas = llamadas.sort((a, b) =>
    a.inicio >= b.inicio ? 1 : -1
  );
  let time = 1587130200;
  let length = time + parseInt(plazo);

  for (time; time < length; time++) {
    const logLlamadas = llamadasEnCurso.map((item) => item.id);

    if (llamadasEnCurso.length > 0) {
      //1ro chequea si alguna llamada en curso se terminó
      llamadasEnCurso.forEach((llamada, i) => {
        if (llamada.fin <= time) {
          llamadasEnCurso.splice(i, 1);
          document
            .getElementById("activa" + llamada.id)
            .classList.add("llamadaTerminada");
          operadoresDisponibles.push(1);
          personasHablando--;
        }
      });
    }
    if (llamadasEnEspera.length > 0) {
      //2do si hay pendientes entra la llamada en espera
      if (operadoresDisponibles.indexOf(1) === -1) {
        llamadasEnEspera.forEach((item) => (item.espera += 1));
      } else {
        while (
          operadoresDisponibles.indexOf(1) !== -1 &&
          llamadasEnEspera.length >= 1
        ) {
          if (llamadasEnEspera.length > 0) {
            llamadasEnEspera[0].espera > esperaMax
              ? (esperaMax = llamadasEnEspera[0].espera)
              : null;

            let llamadaAMover = llamadasEnEspera.shift();
            llamadaAMover.fin = time + llamadaAMover.duracion;

            llamadasEnCurso.push(llamadaAMover);
            contador++;
            llamadasEnEsperaContador--;
            llamadasEnCursoContador++;
            contenedorEnCurso.append(dibujarActiva(llamadaAMover, false));
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
        if (operadoresDisponibles.indexOf(1) !== -1) {
          operadoresDisponibles.pop();
          const agregar = {
            ...llamada,
            fin: time + llamada.duracion,
          };
          llamadasEnCurso.push(agregar);
          contador++;
          llamadasEnCursoContador++;
          contenedorEnCurso.append(dibujarActiva(agregar, true));
          personasHablando++;
          if (personasHablando > maxOperadoresOcupados) {
            maxOperadoresOcupados = personasHablando;
          }
        } else {
          const enEspera = { ...llamada, espera: 1 };
          contenedorEnEspera.append(dibujarEnEspera(enEspera));
          llamadasEnEspera.push(enEspera);
          llamadasEnEsperaContador++;
          console.log(
            "no hay operadores disponibles, poniendo llamada en espera"
          );
        }
      }
    });
  }

  for (llamada of llamadasEnEspera) {
    contenedorPerdidas.append(dibujarPerdida(llamada));
  }

  console.log(
    "contadorEspera",
    llamadasEnEsperaContador,
    "contadorCurso",
    llamadasEnCursoContador
  );

  return [
    maxOperadoresOcupados,
    esperaMax,
    llamadasEnCursoContador,
    llamadasEnEsperaContador,
  ];
}

// Identificando elementos
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
const indicador1 = document.getElementById("indicador1");
const esperaMaxDeseadaInput = document.getElementById("maxEspera");
const cantOperadoresInput = document.getElementById("cantOperadores");

// listener & mode selectors
startButton.addEventListener("click", calcMaxWait);

let radios = document.querySelectorAll("input[type=radio]");

radios.forEach((radio) =>
  radio.addEventListener("change", () => modeSelect(radio.value))
);

function modeSelect(value) {
  startButton.removeEventListener("click", calcMaxWait);
  cantOps.innerText = "";
  tEspera.innerText = "";
  cantLlam.innerText = "";
  clearContainers();

  if (value === "radioQoperadores") {
    startButton.addEventListener("click", calcMaxWait) &&
      startButton.removeEventListener("click", calcNeededOps);
    esperaMaxDeseadaInput.disabled = true;
    cantOperadoresInput.disabled = false;
    indicador1.innerText = "Máximos operadores simultáneos/totales:";
  } else {
    startButton.addEventListener("click", calcNeededOps) &&
      startButton.removeEventListener("click", calcMaxWait);
    esperaMaxDeseadaInput.disabled = false;
    cantOperadoresInput.disabled = true;
    indicador1.innerText =
      "Cantidad de operadores necesaria para no exceder espera:";
  }
}

// variables
let cantOperadoresTest = 1;
let triedOpsValues = [];
let checkError = '';
// functions

function getValues() {
  const cantLlamadas = +document.getElementById("cantLlamadas").value;
  const minDuracion = +document.getElementById("minDuracion").value;
  const maxDuracion = +document.getElementById("maxDuracion").value;
  const plazo = +document.getElementById("segundosPlazo").value;
  const esperaMaxDeseada = document.getElementById("maxEspera").value;
  const cantOperadores = +document.getElementById("cantOperadores").value;

  return {
    cantLlamadas,
    minDuracion,
    maxDuracion,
    plazo,
    esperaMaxDeseada,
    cantOperadores,
  };
}

function checkValues(
  cantLlamadas,
  minDuracion,
  maxDuracion,
  plazo,
  esperaMaxDeseada = 1,
  cantOperadores = 1
) {
  if (
    cantOperadores.value < 1 ||
    cantOperadores.value > 100 ||
    cantLlamadas < 1 ||
    cantLlamadas > 10000 ||
    minDuracion < 1 ||
    minDuracion > 100 ||
    maxDuracion < 2 ||
    maxDuracion > 1000 ||
    plazo < 1 ||
    plazo > 40000 ||
    esperaMaxDeseada < 1 ||
    esperaMaxDeseada > 1000
  ) {
    checkError = 'Hay un problema con los números ingresados, podés manejarte dentro de los rangos permitidos usando los controles de cada campo'
    return true;
  }

  if (plazo < cantLlamadas * 3) {
    checkError = 'La duración de la sesión para atender debe al menos triplicar la cantidad de llamadas'
    return true
  }
}

function calcMaxWait() {
  const { cantLlamadas, minDuracion, maxDuracion, plazo, cantOperadores } =
    getValues();
  const check = checkValues(
    cantLlamadas,
    minDuracion,
    maxDuracion,
    plazo,
    cantOperadores
  );
  if (check) {
    alert(
      checkError
    );
    return;
  }

  clearContainers();

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
  contenedorOpciones.classList.remove("show");
}

function calcNeededOps() {
  const { cantLlamadas, minDuracion, maxDuracion, plazo, esperaMaxDeseada } =
    getValues();
  const check = checkValues(
    cantLlamadas,
    minDuracion,
    maxDuracion,
    plazo,
    esperaMaxDeseada
  );
  if (check) {
    alert(
      "Hay un problema con los números ingresados, podés manejarte dentro de los rangos permitidos (aclarados en cada opción) usando los controles de cada campo"
    );
    return;
  }
  console.log("with q operadores", cantOperadoresTest);
  triedOpsValues.push(cantOperadoresTest);
  let llamadas = [];

  clearContainers();

  llamadas = generarLlamadas(cantLlamadas, minDuracion, maxDuracion);

  for (let llamada of llamadas) {
    contenedorLlamadas.append(dibujarLlamada(llamada));
  }

  let [ops, esp, atend, perd] = calcularLlamadas(
    llamadas,
    cantOperadoresTest,
    plazo
  );

  cantOps.innerText = ops + " operadores";
  tEspera.innerText = esp + " segundos";
  cantLlam.innerText = cantLlamadas + " / " + atend + " / " + perd;

  console.log("esperaMax", esp, esperaMaxDeseada, "perdidas", perd);

  if (cantOperadoresTest > 100) {
    console.log("Max ops");
    alert(
      "Ni siquiera con 100 operadores se alcanza a atender todos los llamados en el plazo, aumentá el margen admitido para obtener una respuesta exacta."
    );
      clearContainers();
    cantOps.innerText = "";
    tEspera.innerText = "";
    cantLlam.innerText = "";
    return;
  }

  if (esp > esperaMaxDeseada || perd > 0) {
    if (
      (esp / 2 > esperaMaxDeseada || perd > cantLlamadas / 5) &&
      cantOperadoresTest < 99
    ) {
      cantOperadoresTest =
        cantOperadoresTest * 2 > 100 ? 100 : cantOperadoresTest * 2;
      console.log("probando con doble de ops");
      calcNeededOps();
    } else {
      cantOperadoresTest++;
      console.log("probando con un op más");
      calcNeededOps();
    }
  } else if (esp <= esperaMaxDeseada && perd === 0) {
    console.log("cortar?", cantOperadoresTest, triedOpsValues);
    if (triedOpsValues.includes(cantOperadoresTest--)) {
      document.getElementById("cantOperadores").value = cantOperadoresTest;
    } else {
      cantOperadoresTest--;
      console.log("probando con un op menos");
    }
  } else {
    alert("No se pudo obtener una respuesta");
  }
  cantOperadoresTest < 101 ? contenedorOpciones.classList.remove("show") : null;
}

function calcularLlamadas(llamadas, operadores, plazo) {
  let personasHablando = 0;
  let operadoresDisponibles = new Array(+operadores).fill(1);
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
            // console.log("habilitar operador llamada en espera");
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
          // console.log(
          //   "no hay operadores disponibles, poniendo llamada en espera"
          // );
        }
      }
    });
  }

  for (llamada of llamadasEnEspera) {
    contenedorPerdidas.append(dibujarPerdida(llamada));
  }


  return [
    maxOperadoresOcupados,
    esperaMax,
    llamadasEnCursoContador,
    llamadasEnEsperaContador,
  ];
}

function clearContainers() {
  contenedorEnCurso.innerHTML = "";
  contenedorEnEspera.innerHTML = "";
  contenedorLlamadas.innerHTML = "";
  contenedorPerdidas.innerHTML = "";
}
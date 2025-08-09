// Guardamos los objetos en un array global
const objetos = [];

const form = document.getElementById('formObjetos');
const tablaCuerpo = document.querySelector('#tablaObjetos tbody');
const resultadoDiv = document.getElementById('resultado');

const inputPeso = document.getElementById('peso');
const inputValor = document.getElementById('valor');
const inputCapacidad = document.getElementById('capacidad');

const btnAgregar = document.getElementById('agregarObjeto');

// Función para actualizar la tabla con los objetos que hemos agregado
function actualizarTabla() {
  tablaCuerpo.innerHTML = ''; // Limpiar tabla
  objetos.forEach((obj, index) => {
    const fila = document.createElement('tr');
    const valorPeso = (obj.valor / obj.peso).toFixed(2);
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${obj.peso} kg</td>
      <td>${obj.valor} $</td>
      <td>${valorPeso}</td>
    `;
    tablaCuerpo.appendChild(fila);
  });
}

// Función para agregar un objeto desde los inputs
function agregarObjeto() {
  const peso = parseFloat(inputPeso.value);
  const valor = parseFloat(inputValor.value);

  if (isNaN(peso) || isNaN(valor) || peso <= 0 || valor <= 0) {
    alert('Por favor, ingresa valores positivos y válidos para peso y valor.');
    return;
  }

  objetos.push({ peso, valor });

  actualizarTabla();

  // Limpiar inputs para agregar otro objeto
  inputPeso.value = '';
  inputValor.value = '';
  inputPeso.focus();
}

// Función que aplica el algoritmo voraz de mochila fraccionaria
function mochilaFraccionaria(capacidad, objetos) {
  // Primero ordenamos los objetos por valor/peso descendente
  const objetosOrdenados = objetos
    .map(obj => ({
      ...obj,
      valorPeso: obj.valor / obj.peso
    }))
    .sort((a, b) => b.valorPeso - a.valorPeso);

  let pesoActual = 0;
  let valorTotal = 0;
  const resultado = [];

  for (const obj of objetosOrdenados) {
    if (pesoActual + obj.peso <= capacidad) {
      // Cabe completo
      pesoActual += obj.peso;
      valorTotal += obj.valor;
      resultado.push({ ...obj, cantidad: obj.peso, fraccion: 1 });
    } else {
      // Solo entra una fracción
      const espacioRestante = capacidad - pesoActual;
      if (espacioRestante <= 0) break;

      const fraccion = espacioRestante / obj.peso;
      pesoActual += espacioRestante;
      valorTotal += obj.valor * fraccion;
      resultado.push({ ...obj, cantidad: espacioRestante, fraccion });
      break; // La mochila ya está llena
    }
  }

  return { valorTotal, pesoActual, resultado };
}

// Evento para el botón de agregar objeto
btnAgregar.addEventListener('click', agregarObjeto);

// Evento para el submit del formulario (calcular solución)
form.addEventListener('submit', e => {
  e.preventDefault();

  const capacidad = parseFloat(inputCapacidad.value);
  if (isNaN(capacidad) || capacidad <= 0) {
    alert('Por favor, ingresa una capacidad válida para la mochila.');
    return;
  }

  if (objetos.length === 0) {
    alert('Agrega al menos un objeto antes de calcular.');
    return;
  }

  const solucion = mochilaFraccionaria(capacidad, objetos);

  // Mostrar resultado
  let html = `<h3>Resultado:</h3>`;
  html += `<p><strong>Valor total en la mochila:</strong> ${solucion.valorTotal.toFixed(2)} $</p>`;
  html += `<p><strong>Peso total usado:</strong> ${solucion.pesoActual.toFixed(2)} kg</p>`;
  html += `<table border="1" cellpadding="5" cellspacing="0">
    <thead>
      <tr><th>Objeto</th><th>Peso tomado</th><th>Valor tomado</th><th>Fracción</th></tr>
    </thead><tbody>`;

  solucion.resultado.forEach((obj, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td>${obj.cantidad.toFixed(2) + " kg"}</td>
      <td>${(obj.valorPeso * obj.cantidad).toFixed(2) + " $"}</td>
      <td>${(obj.fraccion * 100).toFixed(2)}%</td>
    </tr>`;
  });

  html += `</tbody></table>`;

  resultadoDiv.innerHTML = html;
});

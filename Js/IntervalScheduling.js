// script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tareasForm');
  const nombreInput = document.getElementById('nombreTarea');
  const inicioInput = document.getElementById('horaInicio');
  const finInput = document.getElementById('horaFin');
  const listaTareas = document.getElementById('listaTareas');

  let tareas = [];

  // Convierte "HH:MM" -> minutos desde medianoche (número)
  function tiempoAMinutos(t) {
    if (!t) return NaN;
    const parts = t.split(':').map(Number);
    return parts[0] * 60 + parts[1];
  }

  // Muestra la lista completa de tareas ingresadas
  function mostrarTareas() {
    listaTareas.innerHTML = '';
    tareas.forEach((t, i) => {
      const li = document.createElement('li');
      li.textContent = `${t.nombre}: ${t.inicio} - ${t.fin}`;
      listaTareas.appendChild(li);
    });
  }

  // Inserta (si no existe) un contenedor justo después del h2 "Resultado del algoritmo voraz"
  function obtenerContenedorResultado() {
    let cont = document.getElementById('resultado');
    if (cont) return cont;

    // Buscar el h2 correcto
    const headings = Array.from(document.querySelectorAll('h2'));
    const heading = headings.find(h => h.textContent.trim().toLowerCase() === 'resultado del algoritmo voraz');

    cont = document.createElement('div');
    cont.id = 'resultado';
    cont.style.whiteSpace = 'pre-wrap'; // que respete saltos de línea

    if (heading && heading.parentNode) {
      heading.parentNode.insertBefore(cont, heading.nextSibling);
    } else {
      // fallback: agregar al final del body
      document.body.appendChild(cont);
    }
    return cont;
  }

  // Aplica el algoritmo voraz y muestra las tareas seleccionadas
  function mostrarTareasSeleccionadas() {
    const cont = obtenerContenedorResultado();

    // Ordenar por tiempo de fin (minutos)
    const ordenadas = tareas.slice().sort((a, b) => a.finMin - b.finMin);

    const seleccionadas = [];
    let ultimoFin = -1;

    for (const t of ordenadas) {
      if (t.inicioMin >= ultimoFin) {
        seleccionadas.push(t);
        ultimoFin = t.finMin;
      }
    }

    if (seleccionadas.length === 0) {
      cont.innerHTML = '<strong>Tareas seleccionadas:</strong>\n(ninguna aún)';
      return;
    }

    // Construir HTML simple
    const lines = seleccionadas.map(t => `- ${t.nombre}: ${t.inicio} - ${t.fin}`);
    cont.innerHTML = '<strong>Tareas seleccionadas:</strong>\n' + lines.join('\n');
  }

  // Al enviar el formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = (nombreInput.value || '').trim();
    const inicio = inicioInput.value;
    const fin = finInput.value;

    if (!nombre || !inicio || !fin) {
      alert('Completa todos los campos, porfa.');
      return;
    }

    const inicioMin = tiempoAMinutos(inicio);
    const finMin = tiempoAMinutos(fin);

    if (isNaN(inicioMin) || isNaN(finMin) || inicioMin >= finMin) {
      alert('La hora de inicio debe ser menor que la hora de fin (formato 09:00).');
      return;
    }

    // Guardar la tarea (con mins para comparar)
    tareas.push({
      nombre,
      inicio,
      fin,
      inicioMin,
      finMin
    });

    form.reset();
    nombreInput.focus();

    mostrarTareas();
    mostrarTareasSeleccionadas();
  });
});

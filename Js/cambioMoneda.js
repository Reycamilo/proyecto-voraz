

// Inputs del usuario
const montoInput = document.getElementById('monto');          
const monedasInput = document.getElementById('monedas');      
const calcularBtn = document.getElementById('calcular');     

// Elementos para mostrar resultados
const monedasUsadasEl = document.getElementById('monedas-usadas');  
const totalMonedasEl = document.getElementById('total-monedas');   

// 1. Funcion principal
function calcularCambio(monto, monedas) {
    let resto = monto;               // Cantidad restante por cambiar
    const monedasUsadas = [];        // Aquí guardaremos las monedas que usamos
    
    // Recorremos las monedas ordenadas de mayor a menor
    for (const moneda of monedas) {
        
        while (resto >= moneda) {
            monedasUsadas.push(moneda);  
            resto -= moneda;             
        }
    }
    
    return {
        monedasUsadas: monedasUsadas,
        totalMonedas: monedasUsadas.length
    };
}



//  validacion de los datos
function validarInputs() {
   
    const monto = parseInt(montoInput.value);
    if (isNaN(monto) || monto <= 0) {
        alert('Por favor ingresa un monto válido (número mayor que 0)');
        return null;
    }

    
    const monedasTexto = monedasInput.value;
    const monedas = monedasTexto.split(',')  // Separar por comas
        .map(item => parseInt(item.trim()))  // Convertir a número y quitar espacios
        .filter(item => !isNaN(item) && item > 0);  // Filtrar solo números positivos

    // validar si hay algo dentro del arreglo
    if (monedas.length === 0) {
        alert('Ingresa al menos una moneda válida (ej: 25, 10, 5, 1 ,...)');
        return null;
    }

    return { monto, monedas };
}



// mostrar los resultados
function mostrarResultado(monedasUsadas, totalMonedas) {
    monedasUsadasEl.textContent = `Monedas usadas: ${monedasUsadas.join(', ')}`;
    totalMonedasEl.textContent = `Total de monedas: ${totalMonedas}`;
}




// asignamos el evento al boton
calcularBtn.addEventListener('click', function() {
    // 1. Validar y obtener datos de entrada
    const datos = validarInputs();
    if (!datos) return;  
    
    // 2. Ordenar monedas de mayor a menor (requisito del algoritmo voraz)
    datos.monedas.sort((a, b) => b - a);
    
    // 3. Calcular el cambio
    const resultado = calcularCambio(datos.monto, datos.monedas);
    
    // 4. Mostrar resultados
    mostrarResultado(resultado.monedasUsadas, resultado.totalMonedas);
});
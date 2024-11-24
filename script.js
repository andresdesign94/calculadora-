document.addEventListener('DOMContentLoaded', function() {
    // Jornadas
    document.getElementById('calcularJornadas').addEventListener('click', calcularSalarioJornadas);

    // Comisiones
    document.getElementById('calcularComisiones').addEventListener('click', calcularComisiones);

    // Constantes
    const COMISION_ADHERENCIA_VALOR = 15; // Dolares
    const COMISION_GESTION_VALOR = 15; // Dolares
    const COMISION_RECUPERO_VALOR = 30; // Dolares
    const ADHERENCIA_UMBRAL = 0.95; // Umbral de adherencia (95%)
    const GESTIONES_POR_HORA_UMBRAL = 25; // Umbral de gestiones por hora (25)
    const RECUPERO_POR_HORA_UMBRAL_MIN = 270000 * 0.80; // Umbral mínimo de recupero por hora (80% de 270.000)
    const RECUPERO_POR_HORA_UMBRAL_MAX = 270000; // Umbral máximo de recupero por hora (270.000)

    // Funciones auxiliares
    function obtenerNumeroSeguro(idElemento) {
        const valor = document.getElementById(idElemento).value;
        const numero = parseFloat(valor);
        return isNaN(numero) || valor === "" ? 0 : numero;
    }

    function calcularTotalHoras(horas, minutos, segundos) {
        return horas + minutos / 60 + segundos / 3600;
    }

    // Funciones de cálculo
    function calcularSalarioJornadas() {
        const totalSemana = calcularTotalHoras(
            obtenerNumeroSeguro('horasSemana'),
            obtenerNumeroSeguro('minutosSemana'),
            obtenerNumeroSeguro('segundosSemana')
        );
        const totalSabado = calcularTotalHoras(
            obtenerNumeroSeguro('horasSabado'),
            obtenerNumeroSeguro('minutosSabado'),
            obtenerNumeroSeguro('segundosSabado')
        );
        const totalFerias = calcularTotalHoras(
            obtenerNumeroSeguro('horasFerias'),
            obtenerNumeroSeguro('minutosFerias'),
            obtenerNumeroSeguro('segundosFerias')
        );

        const salarioSemana = totalSemana * 0.9;
        const salarioSabado = totalSabado * 1.2;
        const salarioFerias = totalFerias * 1.8;
        const salarioJornadas = salarioSemana + salarioSabado + salarioFerias;

        document.getElementById('salarioJornadas').textContent = `Salario Jornadas: $${salarioJornadas.toFixed(2)}`;
    }

    function calcularComisiones() {
        const horasExigidasMes = obtenerNumeroSeguro('horasExigidasMes');
        const horasTrabajadasMes = obtenerNumeroSeguro('horasTrabajadasMes');
        const gestionesTotalesMes = obtenerNumeroSeguro('gestionesTotalesMes');
        const recuperoTotalMes = obtenerNumeroSeguro('recuperoTotal');

        // Calcular comisiones, almacenando los resultados en variables
        const comisionAdherencia = calcularComisionAdherencia(horasExigidasMes, horasTrabajadasMes);
        const comisionGestionesPorHora = calcularComisionGestionesPorHora(gestionesTotalesMes, horasTrabajadasMes);
        const comisionRecuperoPorHora = calcularComisionRecuperoPorHora(recuperoTotalMes, horasTrabajadasMes);
        const totalComisiones = comisionAdherencia + comisionGestionesPorHora + comisionRecuperoPorHora;

        // Actualizar el DOM con los resultados calculados
        document.getElementById('comisionAdherenciaResultado').textContent = `Comisión Adherencia: $${comisionAdherencia.toFixed(2)}`;
        document.getElementById('comisionGestionesResultado').textContent = `Comisión Gestiones por Hora: $${comisionGestionesPorHora.toFixed(2)}`;
        document.getElementById('comisionRecuperoResultado').textContent = `Comisión Recupero por Hora: $${comisionRecuperoPorHora.toFixed(2)}`;
        document.getElementById('totalComisiones').textContent = `Total Comisiones: $${totalComisiones.toFixed(2)}`;
    }

    function calcularComisionAdherencia(horasExigidasMes, horasTrabajadasMes) {
        const porcentajeAdherencia = Math.min((horasTrabajadasMes / horasExigidasMes) * 100, 100);
        if (porcentajeAdherencia >= ADHERENCIA_UMBRAL) {
            return COMISION_ADHERENCIA_VALOR * (porcentajeAdherencia / 100);
        } else {
            return 0;
        }
    }

    function calcularComisionGestionesPorHora(gestionesTotalesMes, horasTrabajadasMes) {
        const gestionesPorHora = gestionesTotalesMes / horasTrabajadasMes;
        if (gestionesPorHora >= GESTIONES_POR_HORA_UMBRAL) {
            return COMISION_GESTION_VALOR; // Techo de 15 dolares
        } else if (gestionesPorHora >= GESTIONES_POR_HORA_UMBRAL * 0.85) {
            return COMISION_GESTION_VALOR * (gestionesPorHora / GESTIONES_POR_HORA_UMBRAL);
        } else {
            return 0;
        }
    }

    function calcularComisionRecuperoPorHora(recuperoTotalMes, horasTrabajadasMes) {
        const recuperoPorHora = recuperoTotalMes / horasTrabajadasMes;
    
        // Si el recupero por hora está entre el mínimo y el máximo, la comisión es de 24 a 30 dólares
        if (recuperoPorHora >= RECUPERO_POR_HORA_UMBRAL_MIN && recuperoPorHora <= RECUPERO_POR_HORA_UMBRAL_MAX) {
            // Calcula la comisión proporcionalmente entre 24 y 30 dólares
            const porcentajeRecupero = (recuperoPorHora - RECUPERO_POR_HORA_UMBRAL_MIN) / (RECUPERO_POR_HORA_UMBRAL_MAX - RECUPERO_POR_HORA_UMBRAL_MIN);
            const comision = 24 + (6 * porcentajeRecupero); // 6 es la diferencia entre 30 y 24
            return comision;
        } 
    
        // Si el recupero por hora no está dentro del rango, la comisión es 0
        else {
            return 0;
        }
    }
    


    function mostrarResumenComisiones(comisionAdherencia, comisionGestionesPorHora, comisionRecuperoPorHora) {
        const totalComisiones = comisionAdherencia + comisionGestionesPorHora + comisionRecuperoPorHora;

        document.getElementById('comisionAdherenciaTotal').textContent = `Comisión Adherencia: $${comisionAdherencia.toFixed(2)}`;
        document.getElementById('comisionGestionesTotal').textContent = `Comisión Gestiones por Hora: $${comisionGestionesPorHora.toFixed(2)}`;
        document.getElementById('comisionRecuperoTotal').textContent = `Comisión Recupero por Hora: $${comisionRecuperoPorHora.toFixed(2)}`;
        document.getElementById('totalComisiones').textContent = `Total Comisiones: $${totalComisiones.toFixed(2)}`;
    }
});

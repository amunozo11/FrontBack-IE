package com.sinsync.proyectoIE.Operations.Inflación;

public record InflacionRequestDTO(
        String tipo,
        Double tasaNominal,    // para calcular tasa real
        Double tasaReal,       // para calcular tasa nominal
        Double tasaInflacion,  // índice de inflación (e.g., 0.04 para 4%)
        Double valor,          // monto para valor futuro/presente
        Integer periodos       // número de periodos para valor futuro/presente
) {
}

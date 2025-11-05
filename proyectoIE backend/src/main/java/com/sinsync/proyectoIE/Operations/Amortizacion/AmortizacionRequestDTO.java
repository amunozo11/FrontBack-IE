package com.sinsync.proyectoIE.Operations.Amortizacion;

public record AmortizacionRequestDTO(
        double monto,
        double tasa,
        int periodos
) {
}

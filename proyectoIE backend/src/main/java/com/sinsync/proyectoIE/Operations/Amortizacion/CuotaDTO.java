package com.sinsync.proyectoIE.Operations.Amortizacion;

public record CuotaDTO(
        int periodo,
        double cuota,
        double interes,
        double amortizacion,
        double saldo
) {
}

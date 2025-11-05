package com.sinsync.proyectoIE.Operations.Bonos;

public record BonoRequestDTO(
        double valorNominal,
        double tasaCupon,
        double tasaMercado,
        int años,
        FrecuenciaPago frecuencia,
        double precioMercado
) {
}

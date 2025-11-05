package com.sinsync.proyectoIE.Operations.SistemasCapitalizacion.Seguros;

public record SegurosDTO(
        double aportes,
        double tasaInteres,
        int anios,
        double costoSeguro,
        boolean calcularRenta
) {
}

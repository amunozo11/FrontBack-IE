package com.sinsync.proyectoIE.Operations.GradienteAritmetico;

public record GradienteRequest(
        Double primerPago,
        Double incrementoPago,
        Double tasaInteres,
        Double periodos
) {
}

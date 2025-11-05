package com.sinsync.proyectoIE.Operations.gradienteGeometrico;

public record GradienteGRequest(
        double primerPago,
        double tasaInteres,
        double tasaCrecimiento,
        int periodos
) {
}

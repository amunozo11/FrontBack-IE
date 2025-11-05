package com.sinsync.proyectoIE.Loans;

public record CrearPrestamoDTO(
        Double montoPrestamo,
        Double cuotas,
        int tipoInteres,
        int periodicidad,
        String metodoCalculo,
        double tasa
) {
}

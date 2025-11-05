package com.sinsync.proyectoIE.Payments;

public record CrearPagoDTO(
        double valorPago,
        String medioPago,
        String idPrestamo,
        String idCuenta
) {
}

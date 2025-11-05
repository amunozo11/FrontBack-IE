package com.sinsync.proyectoIE.movements;

public record CrearMovimientoDTO(
        String idCuenta,
        Double valor,
        String id_pago
) {
}

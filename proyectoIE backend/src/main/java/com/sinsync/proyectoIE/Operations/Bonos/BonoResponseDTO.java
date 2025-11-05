package com.sinsync.proyectoIE.Operations.Bonos;

public record BonoResponseDTO(
        double precioBono,
        double rendimientoYTM,
        double duracion,
        double convexidad
) {
}

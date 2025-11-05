package com.sinsync.proyectoIE.Operations.anualidades;

public record RequestAnualidad(
        Double tasaAnualidad,
        Double periodoPago,
        Double anualidad
) {
}

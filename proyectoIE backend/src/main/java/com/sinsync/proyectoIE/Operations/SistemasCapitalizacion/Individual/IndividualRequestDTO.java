package com.sinsync.proyectoIE.Operations.SistemasCapitalizacion.Individual;

public record IndividualRequestDTO(
        double aporte,
        double tasa,
        int numAnios,
        int capitalizaciones
) {
}

package com.sinsync.proyectoIE.Operations.EvaluacionAlternativas;

import java.util.List;

public record FlujoAlternativaDTO(
         String nombre,
         double inversionInicial,
         List<Double>flujos
) {
}

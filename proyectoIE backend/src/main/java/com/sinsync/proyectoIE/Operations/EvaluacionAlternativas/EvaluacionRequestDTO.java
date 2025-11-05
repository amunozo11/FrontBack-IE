package com.sinsync.proyectoIE.Operations.EvaluacionAlternativas;

import java.util.List;

public record EvaluacionRequestDTO(
        double tasaDescuento,
        List<FlujoAlternativaDTO> alternativas
) {
}

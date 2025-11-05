package com.sinsync.proyectoIE.Operations.EvaluacionAlternativas;

import java.util.List;

public record EvaluacionResponseDTO(
        List<ResultadoEvaluacionDTO> alternativas,
        String recomendacion
) {
}

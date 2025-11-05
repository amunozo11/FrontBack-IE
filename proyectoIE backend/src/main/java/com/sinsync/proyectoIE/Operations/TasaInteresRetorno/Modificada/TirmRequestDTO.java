package com.sinsync.proyectoIE.Operations.TasaInteresRetorno.Modificada;

import java.util.List;

public record TirmRequestDTO(
        List<CashFlowDTO> flujosPositivos,
        List<CashFlowDTO> flujosNegativos,
        double tasaReinversion,
        double tasaFinanciamiento,
        int periodos
        ) {
}

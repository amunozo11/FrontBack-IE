package com.sinsync.proyectoIE.Operations.SistemasCapitalizacion.Colectiva;

import java.util.List;

public record ColectivaRequestDTO(
        List<ColectivaDataDTO> aportes,
        double tasa
) {
}

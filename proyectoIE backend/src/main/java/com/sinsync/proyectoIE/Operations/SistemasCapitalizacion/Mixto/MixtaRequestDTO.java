package com.sinsync.proyectoIE.Operations.SistemasCapitalizacion.Mixto;

import com.sinsync.proyectoIE.Operations.SistemasCapitalizacion.Colectiva.ColectivaDataDTO;
import com.sinsync.proyectoIE.Operations.SistemasCapitalizacion.Colectiva.ColectivaRequestDTO;

public record MixtaRequestDTO(
        ColectivaDataDTO aporteIndividual,
        ColectivaRequestDTO aportesColectivos,
        double porcentajeIndividual
) {
}

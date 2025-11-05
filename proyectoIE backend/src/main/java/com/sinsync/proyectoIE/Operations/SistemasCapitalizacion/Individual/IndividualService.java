package com.sinsync.proyectoIE.Operations.SistemasCapitalizacion.Individual;

import org.springframework.stereotype.Service;

@Service
public class IndividualService {
    public double calcularIndividual(IndividualRequestDTO request){
        return request.aporte() * Math.pow(1 + request.tasa()/ request.capitalizaciones(), request.capitalizaciones()*request.numAnios());
    }
}

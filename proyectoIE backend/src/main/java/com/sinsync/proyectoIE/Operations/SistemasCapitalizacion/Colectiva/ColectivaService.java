package com.sinsync.proyectoIE.Operations.SistemasCapitalizacion.Colectiva;

import org.springframework.stereotype.Service;

@Service
public class ColectivaService {
    public double calcularColectiva(ColectivaRequestDTO request){
        double fondoTotal = 0.0;
        for(ColectivaDataDTO aporte : request.aportes()){
            fondoTotal+= aporte.monto() * Math.pow(1 + request.tasa(), aporte.tiempo());
        }
        return fondoTotal;
    }
}

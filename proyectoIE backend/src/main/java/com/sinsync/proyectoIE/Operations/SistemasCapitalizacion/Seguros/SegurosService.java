package com.sinsync.proyectoIE.Operations.SistemasCapitalizacion.Seguros;

import org.springframework.stereotype.Service;

@Service
public class SegurosService {
    public ResponseSegurosDTO calcularCapitalYRentabilidad(SegurosDTO request){
        double rentaPeriodica = 0.0;
        double capitalFinal = request.aportes() * Math.pow(1 + request.tasaInteres(), request.anios()) - request.costoSeguro();

        if (request.calcularRenta()){
            rentaPeriodica = capitalFinal * (request.tasaInteres() / (1 - Math.pow(1 + request.tasaInteres(), -request.anios())));
        }
        return new ResponseSegurosDTO(capitalFinal,rentaPeriodica);
    }
}

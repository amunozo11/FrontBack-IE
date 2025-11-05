package com.sinsync.proyectoIE.Operations.anualidades;

import org.springframework.stereotype.Service;

@Service
public class AnualidadesService {
    public double valorFinalAnualidadCierta(RequestAnualidad requestAnualidad){
        return requestAnualidad.anualidad() * ((Math.pow(1 + requestAnualidad.tasaAnualidad(), requestAnualidad.periodoPago()) - 1) / requestAnualidad.tasaAnualidad());
    }

    public double valorActualAnualidadesSimple(RequestAnualidad requestAnualidad){
        return requestAnualidad.anualidad() * ((1 - Math.pow(1 + requestAnualidad.tasaAnualidad(), -requestAnualidad.periodoPago())) / requestAnualidad.tasaAnualidad());
    }
}

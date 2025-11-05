package com.sinsync.proyectoIE.Operations.TasaInteresRetorno.Real;

import org.springframework.stereotype.Service;

@Service
public class TasaRealService {
    public double calcularTasaReal(RealRequestDTO req) {
        return (1 + req.tir()) / (1 + req.inflacion()) - 1;
    }
}

package com.sinsync.proyectoIE.Operations.TasaInteresRetorno.Contable;

import org.springframework.stereotype.Service;

@Service
public class RoiService {
    public double calcularRoi(RoiRequestDTO req) {
        return req.utilidadPromedioAnual() / req.inversionInicial();
    }
}

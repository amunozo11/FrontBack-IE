package com.sinsync.proyectoIE.Operations.gradienteGeometrico;

import org.springframework.stereotype.Service;

@Service
public class GradienteGeometricoService {
    public double calcularValorPresente(GradienteGRequest request) {
        double A = request.primerPago();
        double i = request.tasaInteres();
        double g = request.tasaCrecimiento();
        int n = request.periodos();

        if (i == g) {
            return (A / (1 + i)) * n;
        }

        double razon = (1 + g) / (1 + i);
        return (A / (i - g)) * (1 - Math.pow(razon, n));
    }

    public double calcularValorFuturo(GradienteGRequest request) {
        double A = request.primerPago();
        double i = request.tasaInteres();
        double g = request.tasaCrecimiento();
        int n = request.periodos();

        if (i == g) {
            return (A / (1 + i)) * n * Math.pow(1 + i, n);
        }

        return (A / (i - g)) * (Math.pow(1 + i, n) - Math.pow(1 + g, n));
    }
}

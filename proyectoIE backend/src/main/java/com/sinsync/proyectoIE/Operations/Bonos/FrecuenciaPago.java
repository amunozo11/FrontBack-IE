package com.sinsync.proyectoIE.Operations.Bonos;

public enum FrecuenciaPago {
    ANUAL(1),
    SEMESTRAL(2),
    TRIMESTRAL(4),
    BIMESTRAL(6),
    MENSUAL(12),
    DIARIA(360);

    private final int periodosPorAnio;

    FrecuenciaPago(int periodosPorAnio) {
        this.periodosPorAnio = periodosPorAnio;
    }

    public int getPeriodosPorAnio() {
        return periodosPorAnio;
    }

    public static FrecuenciaPago from(String value) {
        try {
            return FrecuenciaPago.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Frecuencia no válida: " + value);
        }
    }
}

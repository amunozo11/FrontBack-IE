package com.sinsync.proyectoIE.Operations;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Intereses {
    private Double tasaInteres;
    private Double tiempo;
    private Double valorFinal;
    private Double valorPresente;
}

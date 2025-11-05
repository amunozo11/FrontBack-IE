package com.sinsync.proyectoIE.Payments;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "pagos")
public class PagosEntity {
    @Id
    @Column(name = "id_pago")
    private String idPago;
    @Column(name = "valor_pago")
    private double valorPago;
    @Column(name = "tipo_pago")
    private String medioPago;
    @Column(name = "id_prestamo")
    private String idPrestamo;
    @Column(name = "fecha_pago")
    private Date fechaPago;
}

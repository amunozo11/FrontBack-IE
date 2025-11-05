package com.sinsync.proyectoIE.movements;

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
@Table(name = "movimientos")
public class MovimientosEntity {
    @Id
    @Column(name = "id_movimiento")
    private String idMovimiento;
    @Column(name = "id_cuenta")
    private String idCuenta;
    @Column(name = "id_pago")
    private String id_pago;
    private Double valor;
    @Column(name = "fecha_movimiento")
    private Date fechaMovimiento;
}

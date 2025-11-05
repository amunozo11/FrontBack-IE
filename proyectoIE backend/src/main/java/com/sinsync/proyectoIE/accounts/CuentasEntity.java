package com.sinsync.proyectoIE.accounts;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "cuentas")
public class CuentasEntity {
    @Id
    @Column(name = "id_cuenta")
    private String idCuenta;
    @Column(name = "tipo_cuenta")
    private int tipoCuenta;
    private String cedula;
    @Column(name = "saldo_cuenta")
    private Double saldoCuenta;
    @Column(name = "estado_cuenta")
    private boolean estadoCuenta;
}

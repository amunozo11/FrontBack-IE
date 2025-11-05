package com.sinsync.proyectoIE.movements;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface MovimientosRepository extends JpaRepository<MovimientosEntity,String> {
    List<MovimientosEntity> findByIdCuentaOrderByFechaMovimientoDesc(String idCuenta);
}

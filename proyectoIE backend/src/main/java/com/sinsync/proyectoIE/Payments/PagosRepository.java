package com.sinsync.proyectoIE.Payments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PagosRepository extends JpaRepository<PagosEntity,PagosRepository> {
    List<PagosEntity> findByIdPrestamoOrderByFechaPagoDesc(String idPrestamo);
}

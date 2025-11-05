package com.sinsync.proyectoIE.Loans;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrestamosRepository extends JpaRepository<PrestamosEntity,String> {
    List<PrestamosEntity> findByCedulaOrderByFechaSolicitudDesc(String cedula);
}

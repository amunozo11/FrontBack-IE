package com.sinsync.proyectoIE.accounts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CuentasRepository extends JpaRepository<CuentasEntity,String> {
    List<CuentasEntity> findByCedulaAndEstadoCuentaTrue(String cedula);
}

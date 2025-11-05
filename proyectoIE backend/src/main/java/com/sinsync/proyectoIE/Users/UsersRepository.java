package com.sinsync.proyectoIE.Users;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<UsersEntity, String> {
    Optional<UsersEntity> findByIdUser(String idUser);
    boolean existsByCellPhone(String s);
}

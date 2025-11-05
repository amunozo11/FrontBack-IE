package com.sinsync.proyectoIE.Users;

public record UsersDto(
        String name,
        String lastname,
        String password,
        String cellPhone,
        String identification
) {
}

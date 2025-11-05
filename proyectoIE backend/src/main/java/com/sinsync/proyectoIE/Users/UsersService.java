package com.sinsync.proyectoIE.Users;

import com.sinsync.proyectoIE.Doc.GeneratorId;
import com.sinsync.proyectoIE.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsersService {
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public ResponseEntity<ResponseDTOUser> registerUser(UsersDto user){
        try {
            if (usersRepository.existsById(user.identification())) return ResponseEntity.badRequest().body(new ResponseDTOUser("Ya existe una cuenta a su nombre, Inicie sesion"));;
            if (usersRepository.existsByCellPhone(user.cellPhone())) return ResponseEntity.badRequest().body(new ResponseDTOUser("Numero asociado a una cuenta, Ingrese otro numero"));

            UsersEntity userDb = UsersEntity.builder()
                    .idUser(user.identification())
                    .cellPhone(user.cellPhone())
                    .lastname(user.lastname())
                    .name(user.name())
                    .password(passwordEncoder.encode(user.password()))
                    .build();

            usersRepository.save(userDb);
            return ResponseEntity.ok(new ResponseDTOUser("Registrado Correctamente"));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(new ResponseDTOUser(e.getMessage()));
        }
    }

    public ResponseEntity<UsersEntity> findUser(String id){
        var user = usersRepository.findByIdUser(id);
        return ResponseEntity.ok(user.orElseGet(null));
    }
}

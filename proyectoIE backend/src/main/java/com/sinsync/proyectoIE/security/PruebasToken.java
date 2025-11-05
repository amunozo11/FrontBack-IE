package com.sinsync.proyectoIE.security;

import com.sinsync.proyectoIE.Authentication.AuthenticationRequest;
import com.sinsync.proyectoIE.Authentication.AuthenticationResponse;
import com.sinsync.proyectoIE.Authentication.AuthenticationService;
import com.sinsync.proyectoIE.Users.ResponseDTOUser;
import com.sinsync.proyectoIE.Users.UsersDto;
import com.sinsync.proyectoIE.Users.UsersEntity;
import com.sinsync.proyectoIE.Users.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/token")
public class PruebasToken {
    private final JwtService jwtService;
    private final AuthenticationService auth;
    private final UsersService usersService;

    @GetMapping
    public ResponseEntity<String> getToken(){
        UsersEntity user = UsersEntity.builder()
                .idUser("123345")
                .cellPhone("2134235")
                .name("pedri")
                .lastname("Gonzalez")
                .password("holaquetal")
                .build();

        Map<String,Object> extraClaims= new HashMap<>();
        extraClaims.put("id",user.getIdUser());
        extraClaims.put("name", user.getName());
        extraClaims.put("cell", user.getCellPhone());

        return ResponseEntity.ok(jwtService.generateToken(user,extraClaims));
    }

    @PostMapping("/{token}")
    public ResponseEntity<Boolean> validToken(@PathVariable String token){
        return jwtService.isTokenValid(token);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request){
        return auth.login(request);
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDTOUser> register(@RequestBody UsersDto usersDto){
        return usersService.registerUser(usersDto);
    }
}

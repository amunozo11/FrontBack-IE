package com.sinsync.proyectoIE.security;

import com.sinsync.proyectoIE.Users.UsersEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${security.jwt.expiration-minutes}")
    private Long EXPIRATION_MINUTES;
    @Value("${security.jwt.secret-key}")
    private String SECRET_KEY;

    public String generateToken(UsersEntity users, Map<String, Object> extraClaims){
        Date issuetAtt = new Date(System.currentTimeMillis());
        Date expiration = new Date(issuetAtt.getTime()+(EXPIRATION_MINUTES * 60 * 1000));

        String jwt = Jwts.builder()
                //Header
                .header()
                .type("JWT")
                .and()
                //Payload
                .claims(extraClaims)
                .subject(users.getIdUser())
                .issuedAt(issuetAtt)
                .expiration(expiration)
                //firma
                .signWith(generateKey())
                .compact();
        return jwt;
    }

    private SecretKey generateKey(){
        byte[] secretAsByte = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(secretAsByte);
    }
    public String extractID(String jwt){return getBody(jwt).get("id").toString();}

    private Claims getBody(String jwt){
        return Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }
    private boolean isTokenExpired(String token){
        return extractClaim(token, Claims::getExpiration)
                .before(new Date());
    }

    private String extractIdUser(String token){
        return extractClaim(token,Claims::getSubject);
    }

    private String extractName (String token){
        Claims claims = getBody(token);
        return claims.get("name").toString();
    }

    public ResponseEntity<Boolean> isTokenValid(String token){
        try{
            final String idUser = extractID(token);
            if(idUser != null) return ResponseEntity.ok(true);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }
    }

    private <T> T extractClaim(String token, Function<Claims,T> claimsResolver) {
        final Claims claims = getBody(token);
        return claimsResolver.apply(claims);
    }
    public String extraerTokenDesdeHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7); // quita "Bearer "
        } else {
            throw new RuntimeException("Token JWT no encontrado o formato inválido");
        }
    }
}

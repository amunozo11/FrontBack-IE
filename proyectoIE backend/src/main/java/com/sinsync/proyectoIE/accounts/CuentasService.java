package com.sinsync.proyectoIE.accounts;

import com.sinsync.proyectoIE.Doc.GeneratorId;
import com.sinsync.proyectoIE.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CuentasService {
    private final CuentasRepository cuentasRepository;
    private final GeneratorId generatorId;
    private final JwtService jwtService;

    public ResponseEntity<String> crearCuenta(int tipoCuentaCrear, HttpServletRequest requestHeader){
        try{
            var cuenta = CuentasEntity.builder()
                    .estadoCuenta(true)
                    .cedula(jwtService.extractID(jwtService.extraerTokenDesdeHeader(requestHeader)))
                    .saldoCuenta(0.0)
                    .tipoCuenta(tipoCuentaCrear)
                    .idCuenta(generatorId.IdGenerator())
                    .build();
            cuentasRepository.save(cuenta);
            return ResponseEntity.ok("Cuenta Creada Satisfactoriamente");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity<List<CuentasEntity>> obtenerCuentasPorUsuario(HttpServletRequest requestHeader) {
        try {
            String token = jwtService.extraerTokenDesdeHeader(requestHeader);
            String cedula = jwtService.extractID(token);

            List<CuentasEntity> cuentas = cuentasRepository.findByCedulaAndEstadoCuentaTrue(cedula);
            return ResponseEntity.ok(cuentas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<String> congelarCuenta(String idCuenta, HttpServletRequest requestHeader) {
        try {
            String token = jwtService.extraerTokenDesdeHeader(requestHeader);
            String cedula = jwtService.extractID(token);

            Optional<CuentasEntity> cuentaOpt = cuentasRepository.findById(idCuenta);

            if (cuentaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cuenta no encontrada");
            }

            CuentasEntity cuenta = cuentaOpt.get();

            if (!cuenta.getCedula().equals(cedula)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permisos para congelar esta cuenta");
            }

            if (!cuenta.isEstadoCuenta()) {
                return ResponseEntity.badRequest().body("La cuenta ya está congelada");
            }

            cuenta.setEstadoCuenta(false);
            cuentasRepository.save(cuenta);

            return ResponseEntity.ok("Cuenta congelada correctamente");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    public ResponseEntity<String> descongelarCuenta(String idCuenta, HttpServletRequest requestHeader) {
        try {
            String token = jwtService.extraerTokenDesdeHeader(requestHeader);
            String cedula = jwtService.extractID(token);

            Optional<CuentasEntity> cuentaOpt = cuentasRepository.findById(idCuenta);

            if (cuentaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cuenta no encontrada");
            }

            CuentasEntity cuenta = cuentaOpt.get();

            if (!cuenta.getCedula().equals(cedula)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permisos para descongelar esta cuenta");
            }

            if (cuenta.isEstadoCuenta()) {
                return ResponseEntity.badRequest().body("La cuenta ya está activa");
            }

            cuenta.setEstadoCuenta(true);
            cuentasRepository.save(cuenta);

            return ResponseEntity.ok("Cuenta activada correctamente");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

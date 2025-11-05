package com.sinsync.proyectoIE.accounts;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cuentas")
public class CuentasController {
    private final CuentasService cuentasService;

    @PostMapping("/crear")
    public ResponseEntity<String> crearCuentaApp(int tipoCuentaCrear, HttpServletRequest requestHeader){
        return cuentasService.crearCuenta(tipoCuentaCrear,requestHeader);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<CuentasEntity>> buscarCuentas(HttpServletRequest requestHeader){
        return cuentasService.obtenerCuentasPorUsuario(requestHeader);
    }

    @PutMapping("/{idCuenta}/congelar")
    public ResponseEntity<String> congelarCuenta(@PathVariable String idCuenta, HttpServletRequest request) {
        return cuentasService.congelarCuenta(idCuenta, request);
    }

    @PutMapping("/{idCuenta}/descongelar")
    public ResponseEntity<String> descongelarCuenta(@PathVariable String idCuenta, HttpServletRequest request) {
        return cuentasService.descongelarCuenta(idCuenta, request);
    }

}

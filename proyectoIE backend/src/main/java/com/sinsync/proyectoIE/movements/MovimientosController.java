package com.sinsync.proyectoIE.movements;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos")
@RequiredArgsConstructor
public class MovimientosController {
    private final MovimientosService movimientosService;

    @PostMapping
    public ResponseEntity<String> crear(@RequestBody CrearMovimientoDTO dto) {
        return movimientosService.crearMovimiento(dto);
    }

    @GetMapping("/cuenta/{idCuenta}")
    public ResponseEntity<List<MovimientosEntity>> obtenerPorCuenta(@PathVariable String idCuenta) {
        return movimientosService.consultarMovimientosPorCuenta(idCuenta);
    }
}

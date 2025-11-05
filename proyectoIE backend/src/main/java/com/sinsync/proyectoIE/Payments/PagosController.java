package com.sinsync.proyectoIE.Payments;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagos")
@RequiredArgsConstructor
public class PagosController {
    private final PagosService pagosService;

    @PostMapping
    public ResponseEntity<String> registrarPago(@RequestBody CrearPagoDTO dto) {
        return pagosService.registrarPago(dto);
    }

    @GetMapping("/prestamo/{idPrestamo}")
    public ResponseEntity<List<PagosEntity>> obtenerPagosPorPrestamo(@PathVariable String idPrestamo) {
        return pagosService.obtenerPagosPorPrestamo(idPrestamo);
    }
}

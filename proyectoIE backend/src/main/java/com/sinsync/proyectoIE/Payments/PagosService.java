package com.sinsync.proyectoIE.Payments;

import com.sinsync.proyectoIE.Doc.GeneratorId;
import com.sinsync.proyectoIE.movements.CrearMovimientoDTO;
import com.sinsync.proyectoIE.movements.MovimientosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagosService {
    private final PagosRepository pagosRepository;
    private final MovimientosService movimientosService;
    private final GeneratorId generatorId;

    public ResponseEntity<String> registrarPago(CrearPagoDTO dto) {
        try {
            String idPago = generatorId.IdGenerator();
            PagosEntity pago = PagosEntity.builder()
                    .idPago(idPago)
                    .valorPago(dto.valorPago())
                    .medioPago(dto.medioPago())
                    .idPrestamo(dto.idPrestamo())
                    .fechaPago(new Date())
                    .build();

            pagosRepository.save(pago);

            // Aquí llamas al servicio de movimientos
            var message = movimientosService.crearMovimiento(new CrearMovimientoDTO(dto.idCuenta(), dto.valorPago(), idPago));
            if (message.getBody().equals("Movimiento registrado correctamente")) return ResponseEntity.ok("Pago registrado correctamente y movimiento generado");

            return ResponseEntity.badRequest().body("Hubo errores en el pago");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar el pago: " + e.getMessage());
        }
    }

    public ResponseEntity<List<PagosEntity>> obtenerPagosPorPrestamo(String idPrestamo) {
        try {
            return ResponseEntity.ok(pagosRepository.findByIdPrestamoOrderByFechaPagoDesc(idPrestamo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}

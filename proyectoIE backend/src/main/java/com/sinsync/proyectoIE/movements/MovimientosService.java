package com.sinsync.proyectoIE.movements;

import com.sinsync.proyectoIE.Doc.GeneratorId;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimientosService {
    private final MovimientosRepository movimientosRepository;
    private final GeneratorId generatorId;

    public ResponseEntity<String> crearMovimiento(CrearMovimientoDTO dto) {
        try {
            MovimientosEntity movimiento = MovimientosEntity.builder()
                    .idMovimiento(generatorId.IdGenerator())
                    .idCuenta(dto.idCuenta())
                    .valor(dto.valor())
                    .id_pago(dto.id_pago())
                    .fechaMovimiento(new Date())
                    .build();

            movimientosRepository.save(movimiento);

            return ResponseEntity.ok("Movimiento registrado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear movimiento: " + e.getMessage());
        }
    }
    public ResponseEntity<List<MovimientosEntity>> consultarMovimientosPorCuenta(String idCuenta) {
        try {
            List<MovimientosEntity> movimientos = movimientosRepository.findByIdCuentaOrderByFechaMovimientoDesc(idCuenta);
            return ResponseEntity.ok(movimientos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

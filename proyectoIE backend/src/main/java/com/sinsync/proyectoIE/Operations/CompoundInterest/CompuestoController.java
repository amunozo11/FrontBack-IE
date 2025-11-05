package com.sinsync.proyectoIE.Operations.CompoundInterest;

import com.sinsync.proyectoIE.Operations.ResponseOperations;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/compuesto")
@RequiredArgsConstructor
public class CompuestoController {
    private final CompuestoService compuestoService;

    @PostMapping
    public ResponseEntity<ResponseOperations> interesCompuesto(@RequestBody InteresCompuesto interesCompuesto){
        return ResponseEntity.ok(compuestoService.calcularInteresCompuesto(interesCompuesto));
    }
}

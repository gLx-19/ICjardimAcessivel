package com.cefet.plantae_acessivel.controller;

import com.cefet.plantae_acessivel.dto.JardimDTO;
import com.cefet.plantae_acessivel.service.JardimService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jardins")
@CrossOrigin(origins = "*")
public class JardimController {

    private final JardimService service;

    public JardimController(JardimService service) {
        this.service = service;
    }

    // GET: /api/jardins -> retorna diretamente o objeto do Jardim Único
    @GetMapping
    public JardimDTO obterJardim() {
        return service.obterJardimUnico();
    }

    // PUT: /api/jardins -> atualiza os dados do Jardim Único
    @PutMapping
    public JardimDTO atualizar(@Valid @RequestBody JardimDTO dto) {
        return service.atualizar(dto);
    }
}
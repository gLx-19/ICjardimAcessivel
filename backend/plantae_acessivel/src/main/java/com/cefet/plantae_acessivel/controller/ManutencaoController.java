package com.cefet.plantae_acessivel.controller;

import com.cefet.plantae_acessivel.dto.ManutencaoDTO;
import com.cefet.plantae_acessivel.service.ManutencaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manutencoes")
@CrossOrigin(origins = "*")
public class ManutencaoController {

    private final ManutencaoService service;

    public ManutencaoController(ManutencaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ManutencaoDTO> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public ManutencaoDTO cadastrar(@RequestBody ManutencaoDTO dto) {
        return service.cadastrar(dto);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
package com.cefet.plantae_acessivel.controller;

import com.cefet.plantae_acessivel.dto.ManutencaoDTO;
import com.cefet.plantae_acessivel.service.ManutencaoService;

import jakarta.validation.Valid;

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
    public ManutencaoDTO cadastrar(@Valid @RequestBody ManutencaoDTO dto) {
        return service.cadastrar(dto);
    }

   @PutMapping("/{id}")
    public ManutencaoDTO atualizar(@PathVariable Long id, @RequestBody ManutencaoDTO dto) {
        return service.atualizar(id, dto);
    }
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
package com.cefet.plantae_acessivel.controller;

import com.cefet.plantae_acessivel.dto.PlantaDTO;
import com.cefet.plantae_acessivel.service.PlantaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plantas")
@CrossOrigin(origins = "*")
public class PlantaController {

    private final PlantaService service;

    public PlantaController(PlantaService service) {
        this.service = service;
    }

    @GetMapping
    public List<PlantaDTO> listar(@RequestParam(required = false) String pesquisa) {
        return service.listarTodas(pesquisa);
    }

    @GetMapping("/{id}")
    public PlantaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public PlantaDTO cadastrar(@RequestBody PlantaDTO dto) {
        return service.cadastrar(dto);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    @PutMapping("/{id}")
    public PlantaDTO atualizar(@PathVariable Long id, @RequestBody PlantaDTO dto) {
        return service.atualizar(id, dto);
    }
}
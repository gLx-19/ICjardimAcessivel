package com.cefet.plantae_acessivel.controller;

import com.cefet.plantae_acessivel.dto.TagDTO;
import com.cefet.plantae_acessivel.service.TagService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "*")
public class TagController {

    private final TagService service;

    public TagController(TagService service) {
        this.service = service;
    }

    @GetMapping
    public List<TagDTO> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public TagDTO buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public TagDTO cadastrar(@Valid @RequestBody TagDTO dto) {
        return service.cadastrar(dto);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable String id) {
        service.excluir(id);
    }

    @PutMapping("/{id}")
    public TagDTO atualizar(@PathVariable String id, @RequestBody TagDTO dto) {
        return service.atualizar(id, dto);
    }

    
}
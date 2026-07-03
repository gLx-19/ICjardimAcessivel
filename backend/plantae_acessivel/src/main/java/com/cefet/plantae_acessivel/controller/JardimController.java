package com.cefet.plantae_acessivel.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cefet.plantae_acessivel.dto.JardimDTO;
import com.cefet.plantae_acessivel.service.JardimService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jardins")
@CrossOrigin(origins = "*")
public class JardimController {

    private final JardimService service;

    public JardimController(JardimService service) {
        this.service = service;
    }

    @GetMapping
    public List<JardimDTO> listarTodos(@RequestParam(required = false) String pesquisa) {
        return service.listarTodos(pesquisa);
    }

    @GetMapping("/{id}")
    public JardimDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public JardimDTO cadastrar(@Valid @RequestBody JardimDTO dto) {
        return service.cadastrar(dto);
    }

    @PutMapping("/{id}")
    public JardimDTO atualizar(@PathVariable Long id, @Valid @RequestBody JardimDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
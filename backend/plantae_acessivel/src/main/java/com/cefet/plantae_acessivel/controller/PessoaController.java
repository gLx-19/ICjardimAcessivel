package com.cefet.plantae_acessivel.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cefet.plantae_acessivel.dto.LoginDTO;
import com.cefet.plantae_acessivel.dto.PessoaDTO;
import com.cefet.plantae_acessivel.service.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pessoas")
@CrossOrigin(origins = "*")
public class PessoaController {

    private final PessoaService service;

    public PessoaController(PessoaService service) {
        this.service = service;
    }

    @GetMapping
    public List<PessoaDTO> listarTodas() {
        return service.listarTodas();
    }

    @PostMapping
    public PessoaDTO cadastrar(@Valid @RequestBody PessoaDTO dto) {
        return service.cadastrar(dto);
    }

    @PostMapping("/login")
    public PessoaDTO login(@Valid @RequestBody LoginDTO credenciais) { 
        return service.autenticar(credenciais.getCpf(), credenciais.getSenha());
    }
}
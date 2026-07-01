package com.cefet.plantae_acessivel.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cefet.plantae_acessivel.dto.PessoaDTO;
import com.cefet.plantae_acessivel.service.PessoaService;

@RestController
@RequestMapping("/api/pessoas")
@CrossOrigin(origins = "*") // front-end acessa sem bloqueio
public class PessoaController {

    private final PessoaService service;

    PessoaController(PessoaService service) {
        this.service = service;
    }

    // POST: /api/pessoas
    @PostMapping
    public PessoaDTO cadastrar(@RequestBody PessoaDTO dto) {
        return service.cadastrar(dto);
    }

    // POST: /api/pessoas/login
    @PostMapping("/login")
    public PessoaDTO login(@RequestBody PessoaDTO credenciais) {
        // Recebe apenas o CPF e a senha no corpo da requisição para validar
        return service.autenticar(credenciais.getCpf(), credenciais.getSenha());
    }
}
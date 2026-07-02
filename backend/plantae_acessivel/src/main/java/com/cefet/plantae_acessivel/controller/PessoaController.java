package com.cefet.plantae_acessivel.controller;

import com.cefet.plantae_acessivel.dto.PessoaDTO;
import com.cefet.plantae_acessivel.service.PessoaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pessoas")
@CrossOrigin(origins = "*")
public class PessoaController {

    private final PessoaService service;

    public PessoaController(PessoaService service) {
        this.service = service;
    }

    @PostMapping
    public PessoaDTO cadastrar(@RequestBody PessoaDTO dto) {
        return service.cadastrar(dto);
    }

    @PostMapping("/login")
    public PessoaDTO login(@RequestBody PessoaDTO credenciais) {
        return service.autenticar(credenciais.getCpf(), credenciais.getSenha());
    }
}
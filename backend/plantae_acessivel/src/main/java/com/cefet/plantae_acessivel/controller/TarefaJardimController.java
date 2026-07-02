package com.cefet.plantae_acessivel.controller;

import com.cefet.plantae_acessivel.dto.TarefaJardimDTO;
import com.cefet.plantae_acessivel.service.TarefaJardimService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarefas-jardim")
@CrossOrigin(origins = "*")
public class TarefaJardimController {

    private final TarefaJardimService service;

    public TarefaJardimController(TarefaJardimService service) {
        this.service = service;
    }

    @GetMapping
    public List<TarefaJardimDTO> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public TarefaJardimDTO cadastrar(@RequestBody TarefaJardimDTO dto) {
        return service.cadastrar(dto);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
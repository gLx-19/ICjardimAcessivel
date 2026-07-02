package com.cefet.plantae_acessivel.controller;

import com.cefet.plantae_acessivel.dto.TarefaDTO;
import com.cefet.plantae_acessivel.service.TarefaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarefas")
@CrossOrigin(origins = "*")
public class TarefaController {

    private final TarefaService service;

    public TarefaController(TarefaService service) {
        this.service = service;
    }

    @GetMapping
    public List<TarefaDTO> listar(@RequestParam(required = false) Boolean pendentes) {
        if (Boolean.TRUE.equals(pendentes)) {
            return service.listarPendentes();
        }
        return service.listarTodas();
    }

    @PostMapping
    public TarefaDTO cadastrar(@RequestBody TarefaDTO dto) {
        return service.cadastrar(dto);
    }

    @PatchMapping("/{id}/concluir")
    public TarefaDTO concluirTarefa(@PathVariable Long id) {
        return service.marcarComoConcluida(id);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    @PutMapping("/{id}")
    public TarefaDTO atualizar(@PathVariable Long id, @RequestBody TarefaDTO dto) {
        return service.atualizar(id, dto);
    }
}
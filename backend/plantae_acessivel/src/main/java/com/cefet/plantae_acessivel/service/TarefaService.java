package com.cefet.plantae_acessivel.service;

import com.cefet.plantae_acessivel.dto.TarefaDTO;
import com.cefet.plantae_acessivel.entity.Tarefa;
import com.cefet.plantae_acessivel.repository.TarefaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TarefaService {

    // INJEÇÃO VIA CONSTRUTOR (Sem @Autowired)
    private final TarefaRepository repository;

    public TarefaService(TarefaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<TarefaDTO> listarTodas() {
        return repository.findAll().stream().map(TarefaDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TarefaDTO> listarPendentes() {
        return repository.findByConcluidaFalse().stream().map(TarefaDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public TarefaDTO cadastrar(TarefaDTO dto) {
        Tarefa entity = new Tarefa();
        entity.setTitulo(dto.getTitulo());
        entity.setDescricao(dto.getDescricao());
        entity.setDataPrevista(dto.getDataPrevista());
        entity.setConcluida(false); // Toda tarefa nasce pendente

        entity = repository.save(entity);
        return new TarefaDTO(entity);
    }

    @Transactional
    public TarefaDTO marcarComoConcluida(Long id) {
        Tarefa entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada."));

        entity.setConcluida(true);
        entity = repository.save(entity);
        return new TarefaDTO(entity);
    }

    @Transactional
    public void excluir(Long id) {
        repository.deleteById(id);
    }
}
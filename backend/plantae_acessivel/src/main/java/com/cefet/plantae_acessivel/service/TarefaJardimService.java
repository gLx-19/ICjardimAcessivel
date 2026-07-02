package com.cefet.plantae_acessivel.service;

import com.cefet.plantae_acessivel.dto.TarefaJardimDTO;
import com.cefet.plantae_acessivel.entity.Jardim;
import com.cefet.plantae_acessivel.entity.Tarefa;
import com.cefet.plantae_acessivel.entity.TarefaJardim;
import com.cefet.plantae_acessivel.repository.JardimRepository;
import com.cefet.plantae_acessivel.repository.TarefaJardimRepository;
import com.cefet.plantae_acessivel.repository.TarefaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TarefaJardimService {

    private final TarefaJardimRepository repository;
    private final JardimRepository jardimRepository;
    private final TarefaRepository tarefaRepository;

    public TarefaJardimService(TarefaJardimRepository repository, JardimRepository jardimRepository, TarefaRepository tarefaRepository) {
        this.repository = repository;
        this.jardimRepository = jardimRepository;
        this.tarefaRepository = tarefaRepository;
    }

    @Transactional(readOnly = true)
    public List<TarefaJardimDTO> listarTodas() {
        return repository.findAll().stream().map(TarefaJardimDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public TarefaJardimDTO cadastrar(TarefaJardimDTO dto) {
        Jardim jardim = jardimRepository.findById(dto.getJardimId())
                .orElseThrow(() -> new RuntimeException("Jardim não encontrado."));
        Tarefa tarefa = tarefaRepository.findById(dto.getTarefaId())
                .orElseThrow(() -> new RuntimeException("Tarefa base não encontrada."));

        TarefaJardim entity = new TarefaJardim();
        entity.setDescricao(dto.getDescricao());
        entity.setDataPrevista(dto.getDataPrevista());
        entity.setDataRealizacao(dto.getDataRealizacao());
        entity.setJardim(jardim);
        entity.setTarefa(tarefa);

        entity = repository.save(entity);
        return new TarefaJardimDTO(entity);
    }

    @Transactional
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Vínculo de Tarefa Jardim não encontrado.");
        }
        repository.deleteById(id);
    }
}
package com.cefet.plantae_acessivel.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.plantae_acessivel.dto.JardimDTO;
import com.cefet.plantae_acessivel.entity.Jardim;
import com.cefet.plantae_acessivel.repository.JardimRepository;

@Service
public class JardimService {

    private final JardimRepository repository;

    JardimService(JardimRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<JardimDTO> listarTodos(String pesquisa) {
        List<Jardim> lista;
        
        if (pesquisa != null && !pesquisa.trim().isEmpty()) {
            lista = repository.findByNomeContainingIgnoreCase(pesquisa);
        } else {
            lista = repository.findAll();
        }
        
        return lista.stream().map(JardimDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JardimDTO buscarPorId(Long id) {
        Jardim entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jardim não encontrado."));
        return new JardimDTO(entity);
    }

    @Transactional
    public JardimDTO cadastrar(JardimDTO dto) {
        if (repository.existsByNome(dto.getNome())) {
            throw new RuntimeException("Já existe um jardim cadastrado com esse nome.");
        }

        Jardim entity = new Jardim();
        entity.setNome(dto.getNome());
        entity.setDescricao(dto.getDescricao());
        entity.setLocalizacao(dto.getLocalizacao());

        entity = repository.save(entity);
        return new JardimDTO(entity);
    }

    @Transactional
    public JardimDTO atualizar(Long id, JardimDTO dto) {
        Jardim entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jardim não encontrado."));

        entity.setNome(dto.getNome());
        entity.setDescricao(dto.getDescricao());
        entity.setLocalizacao(dto.getLocalizacao());

        entity = repository.save(entity);
        return new JardimDTO(entity);
    }

    @Transactional
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Jardim não encontrado.");
        }
        repository.deleteById(id);
    }
}
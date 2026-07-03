package com.cefet.plantae_acessivel.service;

import com.cefet.plantae_acessivel.dto.JardimDTO;
import com.cefet.plantae_acessivel.entity.Jardim;
import com.cefet.plantae_acessivel.repository.JardimRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JardimService {

    private final JardimRepository repository;

    public JardimService(JardimRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<JardimDTO> listarTodos(String pesquisa) {
        List<Jardim> lista;
        
        // Se a Sabrina enviar um texto no Front-end, filtra pelo nome
        if (pesquisa != null && !pesquisa.isBlank()) {
            lista = repository.findByNomeContainingIgnoreCase(pesquisa);
        } else {
            // Se não enviar nada, lista todos
            lista = repository.findAll();
        }
        
        return lista.stream().map(JardimDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JardimDTO buscarPorId(Long id) {
        Jardim entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jardim não encontrado!"));
        return new JardimDTO(entity);
    }

    @Transactional
    public JardimDTO cadastrar(JardimDTO dto) {
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
                .orElseThrow(() -> new RuntimeException("Jardim não encontrado!"));
        
        entity.setNome(dto.getNome());
        entity.setDescricao(dto.getDescricao());
        entity.setLocalizacao(dto.getLocalizacao());
        
        entity = repository.save(entity);
        return new JardimDTO(entity);
    }

    @Transactional
    public void excluir(Long id) {
        repository.deleteById(id);
    }
}
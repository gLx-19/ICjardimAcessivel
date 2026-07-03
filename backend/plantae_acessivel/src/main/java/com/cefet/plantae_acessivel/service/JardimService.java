package com.cefet.plantae_acessivel.service;

import com.cefet.plantae_acessivel.dto.JardimDTO;
import com.cefet.plantae_acessivel.entity.Jardim;
import com.cefet.plantae_acessivel.repository.JardimRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JardimService {

    private final JardimRepository repository;

    public JardimService(JardimRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public JardimDTO obterJardimUnico() {
        List<Jardim> jardins = repository.findAll();
        
        // Se o banco de dados estiver vazio, cria o jardim único automaticamente
        if (jardins.isEmpty()) {
            Jardim unico = new Jardim();
            unico.setNome("Jardim Plantae Acessível");
            unico.setDescricao("Espaço botânico adaptado para acessibilidade.");
            unico.setLocalizacao("Campus VII - Timóteo");
            unico = repository.save(unico);
            return new JardimDTO(unico);
        }
        
        // Retorna sempre o primeiro e único jardim
        return new JardimDTO(jardins.get(0));
    }

    @Transactional
    public JardimDTO atualizar(JardimDTO dto) {
        List<Jardim> jardins = repository.findAll();
        Jardim entity;
        
        if (jardins.isEmpty()) {
            entity = new Jardim();
        } else {
            entity = jardins.get(0);
        }
        
        entity.setNome(dto.getNome());
        entity.setDescricao(dto.getDescricao());
        entity.setLocalizacao(dto.getLocalizacao());
        
        entity = repository.save(entity);
        return new JardimDTO(entity);
    }
}
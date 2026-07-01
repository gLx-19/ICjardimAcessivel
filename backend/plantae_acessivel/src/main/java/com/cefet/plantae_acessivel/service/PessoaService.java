package com.cefet.plantae_acessivel.service;

import com.cefet.plantae_acessivel.dto.PessoaDTO;
import com.cefet.plantae_acessivel.entity.Pessoa;
import com.cefet.plantae_acessivel.repository.PessoaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PessoaService {

    private final PessoaRepository repository;

    PessoaService(PessoaRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public PessoaDTO cadastrar(PessoaDTO dto) {
        if (repository.existsByCpf(dto.getCpf())) {
            throw new RuntimeException("CPF já cadastrado no sistema.");
        }

        Pessoa entity = new Pessoa();
        entity.setNome(dto.getNome());
        entity.setCpf(dto.getCpf());
        entity.setSenha(dto.getSenha());

        // Se não mandar perfil, vira VISITANTE por padrão
        entity.setPerfil(dto.getPerfil() != null ? dto.getPerfil() : "VISITANTE");

        entity = repository.save(entity);
        return new PessoaDTO(entity);
    }

    @Transactional(readOnly = true)
    public PessoaDTO autenticar(String cpf, String senha) {
        Pessoa entity = repository.findByCpfAndSenha(cpf, senha)
                .orElseThrow(() -> new RuntimeException("CPF ou senha inválidos."));
        return new PessoaDTO(entity);
    }
}
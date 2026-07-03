package com.cefet.plantae_acessivel.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.plantae_acessivel.dto.PessoaDTO;
import com.cefet.plantae_acessivel.entity.PerfilEnum;
import com.cefet.plantae_acessivel.entity.Pessoa;
import com.cefet.plantae_acessivel.repository.PessoaRepository;

@Service
public class PessoaService {

    private final PessoaRepository repository;

    // Injeção via construtor mantida!
    public PessoaService(PessoaRepository repository) {
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

        entity.setPerfil(dto.getPerfil() != null ? dto.getPerfil() : PerfilEnum.VISITANTE);

        entity = repository.save(entity);
        return new PessoaDTO(entity);
    }

    @Transactional(readOnly = true)
    public List<PessoaDTO> listarTodas() {
        return repository.findAll().stream().map(PessoaDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PessoaDTO autenticar(String cpf, String senha) {
        Pessoa entity = repository.findByCpfAndSenha(cpf, senha)
                .orElseThrow(() -> new RuntimeException("CPF ou senha inválidos."));
        return new PessoaDTO(entity);
    }
}
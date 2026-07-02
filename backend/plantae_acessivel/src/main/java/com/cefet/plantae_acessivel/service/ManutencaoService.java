package com.cefet.plantae_acessivel.service;

import com.cefet.plantae_acessivel.dto.ManutencaoDTO;
import com.cefet.plantae_acessivel.entity.Jardim;
import com.cefet.plantae_acessivel.entity.Manutencao;
import com.cefet.plantae_acessivel.repository.JardimRepository;
import com.cefet.plantae_acessivel.repository.ManutencaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManutencaoService {

    private final ManutencaoRepository repository;
    private final JardimRepository jardimRepository;

    public ManutencaoService(ManutencaoRepository repository, JardimRepository jardimRepository) {
        this.repository = repository;
        this.jardimRepository = jardimRepository;
    }

    @Transactional(readOnly = true)
    public List<ManutencaoDTO> listarTodas() {
        return repository.findAll().stream().map(ManutencaoDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public ManutencaoDTO cadastrar(ManutencaoDTO dto) {
        Jardim jardim = jardimRepository.findById(dto.getJardimId())
                .orElseThrow(() -> new RuntimeException("Jardim não encontrado para vincular a manutenção."));

        Manutencao entity = new Manutencao();
        entity.setDescricao(dto.getDescricao());

        // Se a data não vier no DTO, assumimos que a manutenção está sendo registrada
        // no dia de hoje
        entity.setDataRegistro(dto.getDataRegistro() != null ? dto.getDataRegistro() : LocalDate.now());

        entity.setJardim(jardim);

        entity = repository.save(entity);
        return new ManutencaoDTO(entity);
    }

    @Transactional
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Registro de manutenção não encontrado.");
        }
        repository.deleteById(id);
    }

    @Transactional
    public ManutencaoDTO atualizar(Long id, ManutencaoDTO dto) {
        // 1. Busca a manutenção existente pelo ID
        Manutencao entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de manutenção não encontrado."));

        // 2. Busca o jardim atualizado caso tenha sido alterado
        Jardim jardim = jardimRepository.findById(dto.getJardimId())
                .orElseThrow(() -> new RuntimeException("Jardim não encontrado para vincular a manutenção."));

        // 3. Atualiza os dados com o que veio da tela (Front-end)
        entity.setDescricao(dto.getDescricao());
        entity.setDataRegistro(dto.getDataRegistro() != null ? dto.getDataRegistro() : java.time.LocalDate.now());
        entity.setJardim(jardim);

        // 4. Salva no banco de dados e retorna o DTO atualizado
        entity = repository.save(entity);
        return new ManutencaoDTO(entity);
    }
}
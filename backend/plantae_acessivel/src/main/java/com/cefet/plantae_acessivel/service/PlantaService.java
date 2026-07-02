package com.cefet.plantae_acessivel.service;

import com.cefet.plantae_acessivel.dto.PlantaDTO;
import com.cefet.plantae_acessivel.entity.Jardim;
import com.cefet.plantae_acessivel.entity.Planta;
import com.cefet.plantae_acessivel.repository.JardimRepository;
import com.cefet.plantae_acessivel.repository.PlantaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlantaService {

    private final PlantaRepository plantaRepository;
    private final JardimRepository jardimRepository;

    public PlantaService(PlantaRepository plantaRepository, JardimRepository jardimRepository) {
        this.plantaRepository = plantaRepository;
        this.jardimRepository = jardimRepository;
    }

    @Transactional(readOnly = true)
    public List<PlantaDTO> listarTodas(String pesquisa) {
        List<Planta> plantas;
        if (pesquisa != null && !pesquisa.trim().isEmpty()) {
            plantas = plantaRepository.findByNomeContainingIgnoreCaseOrNomeCientificoContainingIgnoreCase(pesquisa,
                    pesquisa);
        } else {
            plantas = plantaRepository.findAll();
        }
        return plantas.stream().map(PlantaDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlantaDTO buscarPorId(Long id) {
        Planta entity = plantaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Planta não encontrada."));
        return new PlantaDTO(entity);
    }

    @Transactional
    public PlantaDTO cadastrar(PlantaDTO dto) {
        Jardim jardim = jardimRepository.findById(dto.getJardimId())
                .orElseThrow(() -> new RuntimeException("Jardim não encontrado."));

        Planta entity = new Planta();
        entity.setNome(dto.getNome());
        entity.setNomeCientifico(dto.getNomeCientifico());
        entity.setDescricao(dto.getDescricao());
        entity.setRega(dto.getRega());
        entity.setPoda(dto.getPoda());
        entity.setLuminosidade(dto.getLuminosidade());
        entity.setFamilia(dto.getFamilia());
        entity.setImagemUrl(dto.getImagemUrl());
        entity.setJardim(jardim); // Amarrou a FK

        entity = plantaRepository.save(entity);
        return new PlantaDTO(entity);
    }

    @Transactional
    public void excluir(Long id) {
        plantaRepository.deleteById(id);
    }
}
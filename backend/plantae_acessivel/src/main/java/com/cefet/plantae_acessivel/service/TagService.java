package com.cefet.plantae_acessivel.service;

import com.cefet.plantae_acessivel.dto.TagDTO;
import com.cefet.plantae_acessivel.entity.Planta;
import com.cefet.plantae_acessivel.entity.Tag;
import com.cefet.plantae_acessivel.repository.PlantaRepository;
import com.cefet.plantae_acessivel.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final PlantaRepository plantaRepository;

    public TagService(TagRepository tagRepository, PlantaRepository plantaRepository) {
        this.tagRepository = tagRepository;
        this.plantaRepository = plantaRepository;
    }

    @Transactional(readOnly = true)
    public List<TagDTO> listarTodas() {
        return tagRepository.findAll().stream().map(TagDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TagDTO buscarPorId(String id) {
        Tag entity = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag NFC não encontrada."));
        return new TagDTO(entity);
    }

    @Transactional
    public TagDTO cadastrar(TagDTO dto) {
        if (tagRepository.existsById(dto.getId())) {
            throw new RuntimeException("Esta Tag NFC já está cadastrada no sistema.");
        }

        Planta planta = null;
        if (dto.getPlantaId() != null) {
            if (tagRepository.existsByPlantaId(dto.getPlantaId())) {
                throw new RuntimeException("Esta planta já possui uma Tag vinculada.");
            }
            planta = plantaRepository.findById(dto.getPlantaId())
                    .orElseThrow(() -> new RuntimeException("Planta não encontrada."));
        }

        Tag entity = new Tag();
        entity.setId(dto.getId());
        entity.setDataVinculo(dto.getDataVinculo());
        entity.setPlanta(planta);

        entity = tagRepository.save(entity);
        return new TagDTO(entity);
    }

    @Transactional
    public void excluir(String id) {
        tagRepository.deleteById(id);
    }
}
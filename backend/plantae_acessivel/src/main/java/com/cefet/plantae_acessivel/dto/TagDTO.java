package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.Tag;
import java.time.LocalDate;

public class TagDTO {

    private String id;
    private LocalDate dataVinculo;
    private Long plantaId;

    public TagDTO() {
    }

    public TagDTO(Tag entity) {
        this.id = entity.getId();
        this.dataVinculo = entity.getDataVinculo();
        if (entity.getPlanta() != null) {
            this.plantaId = entity.getPlanta().getId();
        }
    }

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getDataVinculo() {
        return dataVinculo;
    }

    public void setDataVinculo(LocalDate dataVinculo) {
        this.dataVinculo = dataVinculo;
    }

    public Long getPlantaId() {
        return plantaId;
    }

    public void setPlantaId(Long plantaId) {
        this.plantaId = plantaId;
    }
}
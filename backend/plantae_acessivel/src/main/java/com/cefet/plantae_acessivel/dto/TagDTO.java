package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class TagDTO {

    @NotBlank(message = "O código físico da TAG NFC é obrigatório.")
    private String id;

    private LocalDate dataVinculo;

    @NotNull(message = "A TAG precisa ser vinculada a uma planta existente.")
    private Long plantaId;

    public TagDTO() {
    }

    public TagDTO(Tag entity) {
        this.id = entity.getId();
        this.dataVinculo = entity.getDataVinculo();
        if (entity.getPlanta() != null)
            this.plantaId = entity.getPlanta().getId();
    }

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
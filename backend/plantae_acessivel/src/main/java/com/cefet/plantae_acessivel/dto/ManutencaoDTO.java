package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.Manutencao;
import java.time.LocalDate;

public class ManutencaoDTO {

    private Long id;
    private String descricao;
    private LocalDate dataRegistro;
    private Long jardimId;

    public ManutencaoDTO() {
    }

    public ManutencaoDTO(Manutencao entity) {
        this.id = entity.getId();
        this.descricao = entity.getDescricao();
        this.dataRegistro = entity.getDataRegistro();
        if (entity.getJardim() != null) {
            this.jardimId = entity.getJardim().getId();
        }
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDate getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDate dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public Long getJardimId() {
        return jardimId;
    }

    public void setJardimId(Long jardimId) {
        this.jardimId = jardimId;
    }
}
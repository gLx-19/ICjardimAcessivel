package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.Planta;

public class PlantaDTO {

    private Long id;
    private String nome;
    private String nomeCientifico;
    private String descricao;
    private String rega;
    private String poda;
    private String luminosidade;
    private String familia;
    private String imagemUrl;
    private Long jardimId; // referência da chave estrangeira

    public PlantaDTO() {
    }

    public PlantaDTO(Planta entity) {
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.nomeCientifico = entity.getNomeCientifico();
        this.descricao = entity.getDescricao();
        this.rega = entity.getRega();
        this.poda = entity.getPoda();
        this.luminosidade = entity.getLuminosidade();
        this.familia = entity.getFamilia();
        this.imagemUrl = entity.getImagemUrl();
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

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNomeCientifico() {
        return nomeCientifico;
    }

    public void setNomeCientifico(String nomeCientifico) {
        this.nomeCientifico = nomeCientifico;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getRega() {
        return rega;
    }

    public void setRega(String rega) {
        this.rega = rega;
    }

    public String getPoda() {
        return poda;
    }

    public void setPoda(String poda) {
        this.poda = poda;
    }

    public String getLuminosidade() {
        return luminosidade;
    }

    public void setLuminosidade(String luminosidade) {
        this.luminosidade = luminosidade;
    }

    public String getFamilia() {
        return familia;
    }

    public void setFamilia(String familia) {
        this.familia = familia;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public Long getJardimId() {
        return jardimId;
    }

    public void setJardimId(Long jardimId) {
        this.jardimId = jardimId;
    }
}
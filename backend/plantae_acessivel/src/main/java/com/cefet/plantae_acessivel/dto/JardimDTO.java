package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.Jardim;

public class JardimDTO {

    private Long id;
    private String nome;
    private String descricao;
    private String localizacao;

    public JardimDTO() {
    }

    public JardimDTO(Jardim entity) {
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.descricao = entity.getDescricao();
        this.localizacao = entity.getLocalizacao();
    }

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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}
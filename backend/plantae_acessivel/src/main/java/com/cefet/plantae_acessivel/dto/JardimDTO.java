package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.Jardim;
import jakarta.validation.constraints.NotBlank;

public class JardimDTO {

    private Long id;

    @NotBlank(message = "O nome do jardim é obrigatório.")
    private String nome;

    @NotBlank(message = "A descrição do jardim não pode ficar em branco.")
    private String descricao;

    @NotBlank(message = "A localização é obrigatória.")
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
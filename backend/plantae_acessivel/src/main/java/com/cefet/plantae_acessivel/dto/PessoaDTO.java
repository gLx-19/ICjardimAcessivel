package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.Pessoa;

public class PessoaDTO {

    private Long id;
    private String nome;
    private String cpf;
    private String senha;
    private String perfil;

    public PessoaDTO() {
    }

    public PessoaDTO(Pessoa entity) {
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.cpf = entity.getCpf();
        this.senha = entity.getSenha();
        this.perfil = entity.getPerfil();
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

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }
}
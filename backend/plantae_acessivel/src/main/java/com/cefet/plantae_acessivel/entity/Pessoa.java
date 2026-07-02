package com.cefet.plantae_acessivel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_pessoa")
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(nullable = false)
    private String senha;

    // MUDANÇA AQUI: Tipo mudou de String para PerfilEnum
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PerfilEnum perfil; 

    public Pessoa() {}

    // Getters e Setters atualizados para PerfilEnum
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public PerfilEnum getPerfil() { return perfil; }
    public void setPerfil(PerfilEnum perfil) { this.perfil = perfil; }
}
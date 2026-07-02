package com.cefet.plantae_acessivel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_planta")
public class Planta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String nomeCientifico;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    private String rega;
    private String poda;
    private String luminosidade;
    private String familia;
    private String imagemUrl;

    // a planta obrigatoriamente pertence a um Jardim
    @ManyToOne
    @JoinColumn(name = "jardim_id", nullable = false)
    private Jardim jardim;

    public Planta() {
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

    public Jardim getJardim() {
        return jardim;
    }

    public void setJardim(Jardim jardim) {
        this.jardim = jardim;
    }
}
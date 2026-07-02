package com.cefet.plantae_acessivel.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb_manutencao")
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private LocalDate dataRegistro;

    // CHAVE ESTRANGEIRA: Vincula a Manutenção ao Jardim
    @ManyToOne
    @JoinColumn(name = "jardim_id", nullable = false)
    private Jardim jardim;

    public Manutencao() {
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

    public Jardim getJardim() {
        return jardim;
    }

    public void setJardim(Jardim jardim) {
        this.jardim = jardim;
    }
}
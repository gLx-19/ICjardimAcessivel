package com.cefet.plantae_acessivel.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb_tag")
public class Tag {

    // O ID aqui é String, representando o código único gravado no chip NFC
    @Id
    @Column(nullable = false, unique = true)
    private String id;

    @Column(nullable = false)
    private LocalDate dataVinculo;

    // CHAVE ESTRANGEIRA: Relacionamento 1 para 1 com Planta
    @OneToOne
    @JoinColumn(name = "planta_id", unique = true)
    private Planta planta;

    public Tag() {
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

    public Planta getPlanta() {
        return planta;
    }

    public void setPlanta(Planta planta) {
        this.planta = planta;
    }
}
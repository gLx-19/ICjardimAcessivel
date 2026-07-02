package com.cefet.plantae_acessivel.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb_tarefa_jardim")
public class TarefaJardim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private LocalDate dataPrevista;

    private LocalDate dataRealizacao;

    // CHAVE ESTRANGEIRA: Vincula ao Jardim
    @ManyToOne
    @JoinColumn(name = "jardim_id", nullable = false)
    private Jardim jardim;

    // CHAVE ESTRANGEIRA: Vincula à Tarefa base
    @ManyToOne
    @JoinColumn(name = "tarefa_id", nullable = false)
    private Tarefa tarefa;

    public TarefaJardim() {
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

    public LocalDate getDataPrevista() {
        return dataPrevista;
    }

    public void setDataPrevista(LocalDate dataPrevista) {
        this.dataPrevista = dataPrevista;
    }

    public LocalDate getDataRealizacao() {
        return dataRealizacao;
    }

    public void setDataRealizacao(LocalDate dataRealizacao) {
        this.dataRealizacao = dataRealizacao;
    }

    public Jardim getJardim() {
        return jardim;
    }

    public void setJardim(Jardim jardim) {
        this.jardim = jardim;
    }

    public Tarefa getTarefa() {
        return tarefa;
    }

    public void setTarefa(Tarefa tarefa) {
        this.tarefa = tarefa;
    }
}
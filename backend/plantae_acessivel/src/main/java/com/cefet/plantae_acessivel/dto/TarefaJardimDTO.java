package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.TarefaJardim;
import java.time.LocalDate;

public class TarefaJardimDTO {

    private Long id;
    private String descricao;
    private LocalDate dataPrevista;
    private LocalDate dataRealizacao;
    private Long jardimId;
    private Long tarefaId;

    public TarefaJardimDTO() {
    }

    public TarefaJardimDTO(TarefaJardim entity) {
        this.id = entity.getId();
        this.descricao = entity.getDescricao();
        this.dataPrevista = entity.getDataPrevista();
        this.dataRealizacao = entity.getDataRealizacao();
        if (entity.getJardim() != null) {
            this.jardimId = entity.getJardim().getId();
        }
        if (entity.getTarefa() != null) {
            this.tarefaId = entity.getTarefa().getId();
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

    public Long getJardimId() {
        return jardimId;
    }

    public void setJardimId(Long jardimId) {
        this.jardimId = jardimId;
    }

    public Long getTarefaId() {
        return tarefaId;
    }

    public void setTarefaId(Long tarefaId) {
        this.tarefaId = tarefaId;
    }
}
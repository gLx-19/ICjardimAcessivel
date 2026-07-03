package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.Tarefa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class TarefaDTO {

    private Long id;

    @NotBlank(message = "O título da tarefa é obrigatório.")
    private String titulo;

    private String descricao;

    @NotNull(message = "A data prevista é obrigatória.")
    private LocalDate dataPrevista;

    private boolean concluida;

    public TarefaDTO() {
    }

    public TarefaDTO(Tarefa entity) {
        this.id = entity.getId();
        this.titulo = entity.getTitulo();
        this.descricao = entity.getDescricao();
        this.dataPrevista = entity.getDataPrevista();
        this.concluida = entity.isConcluida();
    }

    // Mantenha os Getters e Setters como estão...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
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

    public boolean isConcluida() {
        return concluida;
    }

    public void setConcluida(boolean concluida) {
        this.concluida = concluida;
    }
}
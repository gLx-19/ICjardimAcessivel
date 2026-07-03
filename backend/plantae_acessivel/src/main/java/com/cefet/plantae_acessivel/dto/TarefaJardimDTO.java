package com.cefet.plantae_acessivel.dto;

import com.cefet.plantae_acessivel.entity.TarefaJardim;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class TarefaJardimDTO {

    private Long id;

    @NotBlank(message = "A descrição do vínculo da tarefa com o jardim é obrigatória.")
    private String descricao;

    @NotNull(message = "A data prevista é obrigatória.")
    private LocalDate dataPrevista;

    private LocalDate dataRealizacao;

    @NotNull(message = "O ID do Jardim é obrigatório.")
    private Long jardimId;

    @NotNull(message = "O ID da Tarefa base é obrigatório.")
    private Long tarefaId;

    public TarefaJardimDTO() {
    }

    public TarefaJardimDTO(TarefaJardim entity) {
        this.id = entity.getId();
        this.descricao = entity.getDescricao();
        this.dataPrevista = entity.getDataPrevista();
        this.dataRealizacao = entity.getDataRealizacao();
        if (entity.getJardim() != null)
            this.jardimId = entity.getJardim().getId();
        if (entity.getTarefa() != null)
            this.tarefaId = entity.getTarefa().getId();
    }

    // Mantenha os Getters e Setters como estão...
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
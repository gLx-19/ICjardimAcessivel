package com.cefet.plantae_acessivel.repository;

import com.cefet.plantae_acessivel.entity.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    //buscar as pendentes
    List<Tarefa> findByConcluidaFalse();
}
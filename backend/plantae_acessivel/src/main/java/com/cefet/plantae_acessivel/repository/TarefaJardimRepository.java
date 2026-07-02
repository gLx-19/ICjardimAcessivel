package com.cefet.plantae_acessivel.repository;

import com.cefet.plantae_acessivel.entity.TarefaJardim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TarefaJardimRepository extends JpaRepository<TarefaJardim, Long> {
    // Busca todas as tarefas agendadas para um jardim específico
    List<TarefaJardim> findByJardimId(Long jardimId);
}
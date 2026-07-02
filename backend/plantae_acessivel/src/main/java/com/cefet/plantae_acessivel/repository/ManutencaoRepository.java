package com.cefet.plantae_acessivel.repository;

import com.cefet.plantae_acessivel.entity.Manutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
    // Permite listar todo o histórico de manutenção de um jardim específico
    List<Manutencao> findByJardimId(Long jardimId);
}
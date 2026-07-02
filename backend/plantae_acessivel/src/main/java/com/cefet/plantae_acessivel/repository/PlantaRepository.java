package com.cefet.plantae_acessivel.repository;

import com.cefet.plantae_acessivel.entity.Planta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlantaRepository extends JpaRepository<Planta, Long> {
    List<Planta> findByJardimId(Long jardimId);
    
    List<Planta> findByNomeContainingIgnoreCaseOrNomeCientificoContainingIgnoreCase(String nome, String nomeCientifico);
}
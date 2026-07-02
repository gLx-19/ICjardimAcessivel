package com.cefet.plantae_acessivel.repository;

import com.cefet.plantae_acessivel.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, String> {
    // Verifica se uma planta já possui uma Tag vinculada
    boolean existsByPlantaId(Long plantaId);
}
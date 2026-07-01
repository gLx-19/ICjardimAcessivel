package com.cefet.plantae_acessivel.repository;

import com.cefet.plantae_acessivel.entity.Jardim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JardimRepository extends JpaRepository<Jardim, Long> {
    // verifica se já existe um jardim com esse nome para evitar duplicatas
    boolean existsByNome(String nome);
}
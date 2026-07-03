package com.cefet.plantae_acessivel.repository;

import com.cefet.plantae_acessivel.entity.Jardim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JardimRepository extends JpaRepository<Jardim, Long> {
    
    // Método mágico do Spring que faz o filtro de pesquisa pelo nome da Sabibi funcionar
    List<Jardim> findByNomeContainingIgnoreCase(String nome);
    
}
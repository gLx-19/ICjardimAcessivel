package com.cefet.plantae_acessivel.repository;

import com.cefet.plantae_acessivel.entity.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

    Optional<Pessoa> findByCpfAndSenha(String cpf, String senha);

    boolean existsByCpf(String cpf);
}
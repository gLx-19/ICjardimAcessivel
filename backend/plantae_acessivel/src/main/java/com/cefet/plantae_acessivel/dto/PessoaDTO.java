package com.cefet.plantae_acessivel.dto;
import jakarta.validation.constraints.Pattern;
import com.cefet.plantae_acessivel.entity.PerfilEnum;
import com.cefet.plantae_acessivel.entity.Pessoa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PessoaDTO {

    private Long id;

    @NotBlank(message = "O nome é obrigatório e não pode estar em branco.")
    private String nome;

    @NotBlank(message = "O CPF é obrigatório.")
    @Pattern(regexp = "^(\\d{11}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2})$", 
             message = "O CPF deve ter 11 números sem formatação ou 14 caracteres no formato XXX.XXX.XXX-XX.")
    private String cpf;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 3, message = "A senha deve ter pelo menos 3 caracteres.")
    private String senha;

    private PerfilEnum perfil;

    public PessoaDTO() {
    }

    public PessoaDTO(Pessoa entity) {
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.cpf = entity.getCpf();
        this.senha = entity.getSenha();
        this.perfil = entity.getPerfil();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public PerfilEnum getPerfil() {
        return perfil;
    }

    public void setPerfil(PerfilEnum perfil) {
        this.perfil = perfil;
    }
}
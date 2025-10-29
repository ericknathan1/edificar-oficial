package com.app.edificar.DTO.response;

import java.time.LocalDate;
import java.util.List;

import com.app.edificar.enums.RoleName;
import com.app.edificar.enums.StatusUsuario;

public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private StatusUsuario status;
    private LocalDate dataCriacao;
    private List<RoleName> roles;


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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public StatusUsuario getStatus() {
        return status;
    }

    public void setStatus(StatusUsuario status) {
        this.status = status;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public List<RoleName> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleName> roles) {
        this.roles = roles;
    }
}

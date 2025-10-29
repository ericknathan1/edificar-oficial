package com.app.edificar.DTO.security;

import java.util.List;

import com.app.edificar.enums.RoleName;

public class UsuarioSecurityRequest {
    private String nome;
    private String email;
    private String senha;
    private List<RoleName> roles;

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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public List<RoleName> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleName> roles) {
        this.roles = roles;
    }

    
}

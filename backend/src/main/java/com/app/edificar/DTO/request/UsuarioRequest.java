package com.app.edificar.DTO.request;

import com.app.edificar.enums.TipoUsuario;

public class UsuarioRequest {
    private String nome;
    private String email;
    private String senhaHash;
    

    public UsuarioRequest(String nome, String email, String senhaHash, TipoUsuario tipo) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
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

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }
}

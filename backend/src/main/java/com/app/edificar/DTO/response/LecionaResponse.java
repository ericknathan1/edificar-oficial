package com.app.edificar.DTO.response;

import com.app.edificar.entity.Turma;

public class LecionaResponse {
    private Long id;
    private TurmaResponse turma;
    private UsuarioResponse usuario;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TurmaResponse getTurma() {
        return turma;
    }

    public void setTurma(TurmaResponse turma) {
        this.turma = turma;
    }

    public UsuarioResponse getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioResponse usuario) {
        this.usuario = usuario;
    }
}

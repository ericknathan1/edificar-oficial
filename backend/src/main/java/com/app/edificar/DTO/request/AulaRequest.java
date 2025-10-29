package com.app.edificar.DTO.request;

import java.time.LocalDate;
import java.time.LocalTime;

public class AulaRequest {
    private LocalDate data;
    private Long turmaId;
    private Long usuarioId;

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Long getTurmaId() {
        return turmaId;
    }

    public void setTurmaId(Long turmaId) {
        this.turmaId = turmaId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

}

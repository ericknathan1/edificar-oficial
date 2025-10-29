package com.app.edificar.DTO.request;

import com.app.edificar.enums.StatusAula;

import java.time.LocalDate;
import java.time.LocalTime;

public class AulaUpdateRequest {
    private LocalDate data;
    private Long usuarioId;


    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}

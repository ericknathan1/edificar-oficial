package com.app.edificar.DTO.response;

import com.app.edificar.enums.StatusUsuario;

public class UsuarioStatusResponse {
    private StatusUsuario status;

    public StatusUsuario getStatus() {
        return status;
    }

    public void setStatus(StatusUsuario status) {
        this.status = status;
    }
}

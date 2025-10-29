package com.app.edificar.DTO.request;

import com.app.edificar.enums.StatusUsuario;

public class UsuarioStatusRequest {
    private StatusUsuario status;

    public StatusUsuario getStatus() {
        return status;
    }

    public void setStatus(StatusUsuario status) {
        this.status = status;
    }
}

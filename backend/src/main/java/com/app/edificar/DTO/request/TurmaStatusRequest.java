package com.app.edificar.DTO.request;

import com.app.edificar.enums.StatusPadrao;

public class TurmaStatusRequest {
    StatusPadrao status;

    public StatusPadrao getStatus() {
        return status;
    }

    public void setStatus(StatusPadrao status) {
        this.status = status;
    }
}

package com.app.edificar.DTO.request;

import com.app.edificar.enums.FrequenciaStatus;

public class FrequenciaRequest {
    private String justificativa;
    private FrequenciaStatus status;
    private Long alunoId;
    private Long aulaId;

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public FrequenciaStatus getStatus() {
        return status;
    }

    public void setStatus(FrequenciaStatus status) {
        this.status = status;
    }

    public Long getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(Long alunoId) {
        this.alunoId = alunoId;
    }

    public Long getAulaId() {
        return aulaId;
    }

    public void setAulaId(Long aulaId) {
        this.aulaId = aulaId;
    }
}

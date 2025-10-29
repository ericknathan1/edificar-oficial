package com.app.edificar.DTO.request;

import com.app.edificar.enums.FrequenciaStatus;

public class FrequenciaStatusRequest {
    private Long alunoId;
    private Long professorId;
    private String justificativa;
    private FrequenciaStatus status;

    public Long getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(Long alunoId) {
        this.alunoId = alunoId;
    }

    public Long getProfessorId() {
        return professorId;
    }

    public void setProfessorId(Long professorId) {
        this.professorId = professorId;
    }

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
}

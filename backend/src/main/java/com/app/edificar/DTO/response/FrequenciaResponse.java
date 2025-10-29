package com.app.edificar.DTO.response;

import com.app.edificar.enums.FrequenciaStatus;

public class FrequenciaResponse {
    private Long id;
    private String justificativa;
    private FrequenciaStatus status;
    private AlunoResponse aluno;
    private AulaResponse aula;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public AlunoResponse getAluno() {
        return aluno;
    }

    public void setAluno(AlunoResponse aluno) {
        this.aluno = aluno;
    }

    public AulaResponse getAula() {
        return aula;
    }

    public void setAula(AulaResponse aula) {
        this.aula = aula;
    }
}

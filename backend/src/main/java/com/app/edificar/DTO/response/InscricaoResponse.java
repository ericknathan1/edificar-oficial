package com.app.edificar.DTO.response;

public class InscricaoResponse {
    private Long id;
    private AlunoDadosResponse aluno;
    private TurmaDadosResponse turma;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AlunoDadosResponse getAluno() {
        return aluno;
    }

    public void setAluno(AlunoDadosResponse aluno) {
        this.aluno = aluno;
    }

    public TurmaDadosResponse getTurma() {
        return turma;
    }

    public void setTurma(TurmaDadosResponse turma) {
        this.turma = turma;
    }
}

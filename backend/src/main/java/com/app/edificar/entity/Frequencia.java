package com.app.edificar.entity;

import com.app.edificar.enums.FrequenciaStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "frequencia")
public class Frequencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "frequencia_id")
    private Long id;
    @Column(name = "frequencia_justificativa")
    private String justificativa;
    @Column(name = "frequencia_status")
    private FrequenciaStatus status;
    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;
    @ManyToOne
    @JoinColumn(name = "aula_id")
    private Aula aula;

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

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Aula getAula() {
        return aula;
    }

    public void setAula(Aula aula) {
        this.aula = aula;
    }
}

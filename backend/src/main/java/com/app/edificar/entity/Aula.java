package com.app.edificar.entity;

import com.app.edificar.enums.StatusAula;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "aula")
public class Aula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aula_id")
    private Long id;
    @Column(name = "aula_data")
    private LocalDate data;
    @Column(name = "aula_hora_inicio")
    private LocalTime horaInicio;
    @Column(name = "aula_hora_fim")
    private LocalTime horaFim;
    @Column(name = "aula_topico")
    private String topico;
    @Column(name = "aula_visitante")
    private Integer visitante;
    @Column(name = "aula_status")
    private StatusAula status;
    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }

    public String getTopico() {
        return topico;
    }

    public void setTopico(String topico) {
        this.topico = topico;
    }

    public Integer getVisitante() {
        return visitante;
    }

    public void setVisitante(Integer visitante) {
        this.visitante = visitante;
    }

    public StatusAula getStatus() {
        return status;
    }

    public void setStatus(StatusAula status) {
        this.status = status;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}

package com.app.edificar.DTO.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.app.edificar.enums.StatusAula;
import com.fasterxml.jackson.annotation.JsonFormat;

public class AulaResponse {
    private Long id;
    private LocalDate data;
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horaInicio;
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horafim;
    private StatusAula statusAula;
    private String topico;
    private Integer visitantes;
    private UsuarioDadosResponse usuario;

    public StatusAula getStatusAula() {
        return statusAula;
    }

    public void setStatusAula(StatusAula statusAula) {
        this.statusAula = statusAula;
    }

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

    public LocalTime getHorafim() {
        return horafim;
    }

    public void setHorafim(LocalTime horafim) {
        this.horafim = horafim;
    }

    public String getTopico() {
        return topico;
    }

    public void setTopico(String topico) {
        this.topico = topico;
    }

    public Integer getVisitantes() {
        return visitantes;
    }

    public void setVisitantes(Integer visitantes) {
        this.visitantes = visitantes;
    }

    public UsuarioDadosResponse getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioDadosResponse usuario) {
        this.usuario = usuario;
    }

    
    
}

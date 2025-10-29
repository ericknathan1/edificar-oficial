package com.app.edificar.DTO.response;

import com.app.edificar.entity.Aula;
import com.app.edificar.entity.Inscricao;
import com.app.edificar.entity.Leciona;
import com.app.edificar.enums.DiaPadrao;
import com.app.edificar.enums.StatusPadrao;

import java.time.LocalDate;
import java.util.List;

public class TurmaResponse {
    private Long id;
    private String nome;
    private String faixaEtaria;
    private DiaPadrao diaPadrao;
    private StatusPadrao statusPadrao;  

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getFaixaEtaria() {
        return faixaEtaria;
    }

    public void setFaixaEtaria(String faixaEtaria) {
        this.faixaEtaria = faixaEtaria;
    }

    public DiaPadrao getDiaPadrao() {
        return diaPadrao;
    }

    public void setDiaPadrao(DiaPadrao diaPadrao) {
        this.diaPadrao = diaPadrao;
    }

    public StatusPadrao getStatusPadrao() {
        return statusPadrao;
    }

    public void setStatusPadrao(StatusPadrao statusPadrao) {
        this.statusPadrao = statusPadrao;
    }
}

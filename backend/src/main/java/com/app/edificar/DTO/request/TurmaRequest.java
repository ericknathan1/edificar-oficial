package com.app.edificar.DTO.request;

import com.app.edificar.enums.DiaPadrao;
import com.app.edificar.enums.StatusPadrao;

public class TurmaRequest {
    private String nome;
    private String faixaEtaria;
    private DiaPadrao diaPadrao;

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
}



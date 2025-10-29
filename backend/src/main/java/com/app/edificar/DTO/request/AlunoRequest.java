package com.app.edificar.DTO.request;

import com.app.edificar.enums.StatusPadrao;

import java.time.LocalDate;

public class AlunoRequest {
    private String nomeCompleto;
    private LocalDate dataNasc;
    private String contatoResponsavel;

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public LocalDate getDataNasc() {
        return dataNasc;
    }

    public void setDataNasc(LocalDate dataNasc) {
        this.dataNasc = dataNasc;
    }

    public String getContatoResponsavel() {
        return contatoResponsavel;
    }

    public void setContatoResponsavel(String contatoResponsavel) {
        this.contatoResponsavel = contatoResponsavel;
    }
}

package com.app.edificar.DTO.response;

import com.app.edificar.entity.Frequencia;
import com.app.edificar.entity.Inscricao;
import com.app.edificar.enums.StatusPadrao;
import java.time.LocalDate;
import java.util.List;

public class AlunoResponse {
    private Long id;
    private String nomeCompleto;
    private LocalDate dataNasc;
    private String contatoResponsavel;
    private LocalDate dataCriacao;
    private StatusPadrao status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public StatusPadrao getStatus() {
        return status;
    }

    public void setStatus(StatusPadrao status) {
        this.status = status;
    }
}

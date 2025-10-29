package com.app.edificar.entity;

import com.app.edificar.enums.StatusPadrao;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "aluno")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aluno_id")
    private Long id;
    @Column(name = "aluno_nome_completo")
    private String nomeCompleto;
    @Column(name = "aluno_data_nasc")
    private LocalDate dataNasc;
    @Column(name = "aluno_contato_responsavel")
    private String contatoResponsavel;
    @Column(name = "aluno_data_criacao")
    private LocalDate dataCriacao;
    @Column(name = "aluno_status")
    private StatusPadrao status;
    @OneToMany(mappedBy = "aluno")
    private List<Inscricao> inscricoes;
    @OneToMany(mappedBy = "aluno")
    private List<Frequencia> frequencias;

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

    public List<Inscricao> getInscricoes() {
        return inscricoes;
    }

    public void setInscricoes(List<Inscricao> inscricoes) {
        this.inscricoes = inscricoes;
    }

    public List<Frequencia> getFrequencias() {
        return frequencias;
    }

    public void setFrequencias(List<Frequencia> frequencias) {
        this.frequencias = frequencias;
    }
    public StatusPadrao getStatus() {return status;}
    public void setStatus(StatusPadrao status) {this.status = status;}
}

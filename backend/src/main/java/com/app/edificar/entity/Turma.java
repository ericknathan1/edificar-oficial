package com.app.edificar.entity;

import com.app.edificar.enums.DiaPadrao;
import com.app.edificar.enums.StatusPadrao;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "turma")
public class Turma {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "turma_id")
    private Long id;
    @Column(name = "turma_nome")
    private String nome;
    @Column(name = "turma_faixa_etaria")
    private String faixaEtaria;
    @Column(name = "turma_dia_padrao")
    private DiaPadrao diaPadrao;
    @Column(name = "turma_status")
    private StatusPadrao status;
    @OneToMany(mappedBy = "turma")
    private List<Inscricao> inscricoes;
    @OneToMany(mappedBy = "turma")
    private List<Aula> aulas;
    @OneToMany(mappedBy = "turma")
    private List<Leciona> lecionas;

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

    public StatusPadrao getStatus() {
        return status;
    }

    public void setStatus(StatusPadrao status) {
        this.status = status;
    }

    public List<Inscricao> getInscricoes() {
        return inscricoes;
    }

    public void setInscricoes(List<Inscricao> inscricoes) {
        this.inscricoes = inscricoes;
    }

    public List<Aula> getAulas() {
        return aulas;
    }

    public void setAulas(List<Aula> aulas) {
        this.aulas = aulas;
    }

    public List<Leciona> getLecionas() {
        return lecionas;
    }

    public void setLecionas(List<Leciona> lecionas) {
        this.lecionas = lecionas;
    }
}

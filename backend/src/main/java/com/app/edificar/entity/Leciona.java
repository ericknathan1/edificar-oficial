package com.app.edificar.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "leciona")
public class Leciona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leciona_id")
    private Long id;
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

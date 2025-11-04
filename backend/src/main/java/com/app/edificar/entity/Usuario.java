package com.app.edificar.entity;

import java.time.LocalDate;
import java.util.List;

import com.app.edificar.enums.StatusUsuario;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_id")
    private Long id;
    @Column(name = "usuario_nome")
    private String nome;
    @Column(name = "usuario_email", unique=true)
    private String email;
    @Column(name = "usuario_senha_hash")
    private String senhaHash;
    @Column(name = "usuario_status")
    private StatusUsuario status;
    @Column(name = "usuario_data_criacao")
    private LocalDate dataCriacao;
    @OneToMany(mappedBy = "usuario")
    private List<Leciona> lecionas;
    @OneToMany(mappedBy = "usuario")
    private List<Aula> aulas;
   @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
   @JoinTable(name="usuario_role",
           joinColumns = @JoinColumn(name = "usuario_id"),
           inverseJoinColumns = @JoinColumn(name="role_id"))
   private List<Role> roles;

    public Usuario() {
    }

   public List<Role> getRoles() {
       return roles;
   }

   public void setRoles(List<Role> roles) {
       this.roles = roles;
   }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public List<Leciona> getLecionas() {
        return lecionas;
    }

    public void setLecionas(List<Leciona> lecionas) {
        this.lecionas = lecionas;
    }

    public List<Aula> getAulas() {
        return aulas;
    }

    public void setAulas(List<Aula> aulas) {
        this.aulas = aulas;
    }

    public StatusUsuario getStatus() {
        return status;
    }

    public void setStatus(StatusUsuario status) {
        this.status = status;
    }
}

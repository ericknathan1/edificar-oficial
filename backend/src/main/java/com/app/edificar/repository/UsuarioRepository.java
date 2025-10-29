package com.app.edificar.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.edificar.entity.Usuario;

import jakarta.transaction.Transactional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {
    @Query("SELECT u FROM Usuario u WHERE u.id=:id")
    Usuario usuarioPorId(@Param("id") Long usuarioId);
    @Query("SELECT u FROM Usuario u WHERE u.id=:id AND u.status >= 0")
    Usuario usuarioativoPorId(@Param("id") Long usuarioId);
    @Query("SELECT u from Usuario u WHERE u.status = -1")
    List<Usuario> usuariosApagado();
    @Query("SELECT u FROM Usuario u WHERE u.status >= 0")
    List<Usuario> usuariosAtivos();
    @Query("SELECT u FROM Usuario u")
    List<Usuario> usuarios();
    @Query("SELECT u FROM Usuario u JOIN u.roles r WHERE r.name = 'ROLE_PROFESSOR' AND u.status >= 0")
    List<Usuario> professores();
    @Query("SELECT u FROM Usuario u JOIN u.roles r WHERE u.id = :id AND r.name = 'ROLE_PROFESSOR' AND u.status >= 0")
    List<Usuario> professorPorId(@Param("id") Long usuarioId);
    @Query("SELECT u FROM Usuario u JOIN u.roles r WHERE r.name = 'ROLE_ADMINISTRADOR' AND u.status >= 0")
    List<Usuario> admnistradores();
    @Modifying
    @Transactional
    @Query("UPDATE Usuario u SET u.status = -1 WHERE u.id = :id")
    void apagarUsuario(@Param("id") Long usuarioId);

    Optional<Usuario> findByEmail(String email);
}

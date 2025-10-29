package com.app.edificar.repository;

import com.app.edificar.entity.Leciona;
import com.app.edificar.entity.Turma;
import com.app.edificar.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LecionaRepository extends JpaRepository<Leciona,Long> {
    @Query("SELECT l.usuario FROM Leciona l WHERE l.turma.id=:idTurma")
    List<Usuario> usuarioPorTurmaId(@Param("idTurma") Long idTurma);
    @Query("SELECT l.turma FROM Leciona l WHERE l.usuario.id=:idProfessor")
    List<Turma> turmasPorProfessorId(@Param("idProfessor") Long idProfessor);
    @Query("SELECT COUNT(l) FROM Leciona l WHERE l.turma.id=:idTurma AND l.usuario.id=:idProfessor")
    Long turmaProfessorExiste(@Param("idTurma") Long idTurma, @Param("idProfessor") Long idProfessor);
}


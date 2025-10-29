package com.app.edificar.repository;

import com.app.edificar.entity.Aluno;
import com.app.edificar.entity.Turma;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    @Query("SELECT a FROM Aluno a WHERE a.id = :id")
    Aluno alunoPorId(@Param("id") Long id);

    @Query("SELECT a from Aluno a WHERE a.status >= 0")
    List<Aluno> listarAlunosAtivos();

    @Query("SELECT a from Aluno a")
    List<Aluno> listarAlunos();

    @Modifying
    @Transactional
    @Query("UPDATE Aluno a SET a.status = -1 WHERE a.id = :id")
    void apagarAluno(@Param("id") Long alunoId);
}

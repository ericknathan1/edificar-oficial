package com.app.edificar.repository;

import com.app.edificar.entity.Aluno;
import com.app.edificar.entity.Inscricao;
import com.app.edificar.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InscricaoRepository extends JpaRepository<Inscricao,Long> {
    @Query("SELECT i.aluno FROM Inscricao i WHERE i.turma.id = :turmaId")
    List<Aluno> buscarAlunosPorTurma(@Param("turmaId") Long turmaId);
    @Query("SELECT i.turma FROM Inscricao i WHERE i.aluno.id = :alunoId")
    List<Turma> buscarTurmaPorAluno(@Param("alunoId") Long alunoId);
    @Query("SELECT i.aluno FROM Inscricao i WHERE i.turma.id = :turmaId AND i.aluno.id = :alunoId")
    Aluno buscarAlunoEmTurmaPorId(@Param("turmaId") Long turmaId,@Param("alunoId") Long alunoId);
}

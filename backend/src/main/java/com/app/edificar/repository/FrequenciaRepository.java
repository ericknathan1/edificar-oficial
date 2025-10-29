package com.app.edificar.repository;

import com.app.edificar.entity.Frequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FrequenciaRepository extends JpaRepository<Frequencia,Long> {
    @Query("SELECT f FROM Frequencia f WHERE f.aluno.id= :alunoId")
    List<Frequencia> frequenciasPorAlunoId(@Param("alunoId") Long alunoId);
    @Query("SELECT f FROM Frequencia f WHERE f.aula.id=:aulaId")
    List<Frequencia> frequenciasPorAulaId(@Param("aulaId") Long aulaId);
    @Query("SELECT f FROM Frequencia f WHERE f.aluno.id= :alunoId AND f.aula.id=:aulaId")
    Frequencia frequenciasPorAlunoEAula(@Param("alunoId") Long alunoId,@Param("aulaId") Long aulaId);

}

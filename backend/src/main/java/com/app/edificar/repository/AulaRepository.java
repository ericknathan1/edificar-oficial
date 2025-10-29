package com.app.edificar.repository;

import com.app.edificar.entity.Aula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AulaRepository extends JpaRepository<Aula,Long> {
    @Query("SELECT a FROM Aula a WHERE a.turma.id = :turmaid")
    List<Aula> aulaPorTurmaId(@Param("turmaid") Long turmaid);
    @Query("SELECT a FROM Aula a WHERE a.id=:aulaid")
    Aula aulaPorId(@Param("aulaid") Long aulaid);
    @Query("SELECT a FROM Aula a WHERE a.turma.id = :turmaId AND a.data >= :dataReferencia")
    List<Aula> aulasFuturasPorTurmaId(@Param("turmaId") Long turmaId, @Param("dataReferencia")LocalDate data);

}

package com.app.edificar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.edificar.entity.Turma;

import jakarta.transaction.Transactional;

@Repository
public interface TurmaRepository extends JpaRepository<Turma,Long> {

    @Query("SELECT t FROM Turma t WHERE t.status >= 0")
    List<Turma> turmasAtivas();
    @Query("SELECT t FROM Turma t")
    List<Turma> turmas();
    @Query("SELECT t FROM Turma t WHERE t.id = :id")
    Turma turmaPorId(@Param("id") Long id);
    @Modifying
    @Transactional
    @Query("UPDATE Turma t SET t.status = -1 WHERE t.id = :id")
    void apagarTurma(@Param("id") Long turmaId);

}

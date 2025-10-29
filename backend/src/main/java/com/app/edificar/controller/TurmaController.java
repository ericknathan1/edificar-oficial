package com.app.edificar.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.edificar.DTO.request.TurmaRequest;
import com.app.edificar.DTO.request.TurmaStatusRequest;
import com.app.edificar.DTO.response.AlunoDadosResponse;
import com.app.edificar.DTO.response.AulaResponse;
import com.app.edificar.DTO.response.InscricaoResponse;
import com.app.edificar.DTO.response.LecionaResponse;
import com.app.edificar.DTO.response.TurmaResponse;
import com.app.edificar.DTO.response.UsuarioDadosResponse;
import com.app.edificar.service.TurmaService;
 
@CrossOrigin("*")
@RestController
@RequestMapping("/turmas")
public class TurmaController {
    private TurmaService turmaService;

    public TurmaController(TurmaService turmaService) {
        this.turmaService = turmaService;
    }

    @PostMapping
    public ResponseEntity<TurmaResponse> criarTurma(@RequestBody TurmaRequest turmaRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.turmaService.salvarTurma(turmaRequest));
    }
    @PostMapping("/semAulas")
    public ResponseEntity<TurmaResponse> criarTurmaSemAulas(@RequestBody TurmaRequest turmaRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.turmaService.salvarTurmaSemAulas(turmaRequest));
    }
    @PutMapping("/{id}")
    public ResponseEntity<TurmaResponse> atualizarTurma(@PathVariable("id") Long id,
    TurmaRequest request){
        return ResponseEntity.ok(this.turmaService.mudarTurma(id, request));
    }
    @PatchMapping("/{id}")
    public ResponseEntity<TurmaResponse> atualizarStatusDaTurma(@PathVariable("id") Long id,
    TurmaStatusRequest request){
        return ResponseEntity.ok(this.turmaService.mudarStatusTurma(id, request));
    }
    @GetMapping
    public ResponseEntity<List<TurmaResponse>> listarTurmas(){
        return ResponseEntity.ok(this.turmaService.retornarTurmas());
    }
    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponse> buscarTurmaPorId(@PathVariable("id")Long id){
        return ResponseEntity.ok(this.turmaService.turmaPorId(id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity apagarTurma(@PathVariable("id")Long id) {
        this.turmaService.apagarTurma(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{idTurma}/professores/{idProfessor}")
    public ResponseEntity<LecionaResponse> associarProfessorATurma(
            @PathVariable("idTurma")Long idTurma,@PathVariable("idProfessor") Long idProfessor){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.turmaService.salvarProfessorNaTurma(
                idTurma, idProfessor));
    }
    @PostMapping("/{idTurma}/aluno/{idAluno}")
    public ResponseEntity<InscricaoResponse> associarAlunoATurma(
            @PathVariable("idTurma")Long idTurma,@PathVariable("idAluno") Long idAluno){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.turmaService.salvarAlunoNaTurma(idTurma, idAluno));
    }
    @GetMapping("/{idTurma}/professores")
    public ResponseEntity<List<UsuarioDadosResponse>> listarProfessoresDeUmaTurma(@PathVariable("idTurma")Long idTurma){
        return ResponseEntity.ok(this.turmaService.professoresEmUmaTurma(idTurma));
    }
    @GetMapping("/{idTurma}/alunos")
    public ResponseEntity<List<AlunoDadosResponse>> listarAlunosDeUmaTurma(@PathVariable("idTurma")Long idTurma){
        return ResponseEntity.ok(this.turmaService.alunosEmUmaTurma(idTurma));
    }
    @GetMapping("/{idTurma}/aulas")
    public ResponseEntity<List<AulaResponse>> listarAulasDeUmaTurma(@PathVariable("idTurma")Long idTurma){
        return ResponseEntity.ok(this.turmaService.aulasEmUmaTurma(idTurma));
    }
}

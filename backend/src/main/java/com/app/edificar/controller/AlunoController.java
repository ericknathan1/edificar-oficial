package com.app.edificar.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.edificar.DTO.request.AlunoRequest;
import com.app.edificar.DTO.response.AlunoFrequenciaResponse;
import com.app.edificar.DTO.response.AlunoResponse;
import com.app.edificar.DTO.response.TurmaResponse;
import com.app.edificar.service.AlunoService;

@CrossOrigin("*")
@RestController
@RequestMapping("/alunos")
public class AlunoController {
    private AlunoService service; 

    public AlunoController(AlunoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AlunoResponse>> listarAlunos() {
        return ResponseEntity.ok(this.service.retornarAlunos());
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<AlunoResponse>> listarAlunosAtivos() {
        return ResponseEntity.ok(this.service.retornarAlunosAtivos());
    }

    @GetMapping("/apagados")
    public ResponseEntity<List<AlunoResponse>> listarAlunosApagados() {
        return ResponseEntity.ok(this.service.retornarAlunosApagados());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponse> buscarAluno(@PathVariable("id") Long id) {
        return ResponseEntity.ok(this.service.retornarAluno(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponse> atualizarAluno(@PathVariable("id") Long id, @RequestBody AlunoRequest request) {
        return ResponseEntity.ok(this.service.atualizarAluno(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity apagarAluno(@PathVariable("id") Long id) {
        this.service.apagarAluno(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<AlunoResponse> criarAluno(@RequestBody AlunoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.service.salvarAluno(request));
    }

    @GetMapping("/{id}/frequencias")
    public ResponseEntity<List<AlunoFrequenciaResponse>> listarFrequenciasDeUmAluno(@PathVariable("id") Long id) {
        return ResponseEntity.ok(this.service.retornarFrequenciasPorAluno(id));
    }

    @GetMapping("/{id}/turmas")
    public ResponseEntity<List<TurmaResponse>> listarTurmasDeUmAluno(@PathVariable("id") Long id){
        return ResponseEntity.ok(this.service.retornarTurmaPorAluno(id));
    }


}

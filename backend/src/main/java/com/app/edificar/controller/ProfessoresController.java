package com.app.edificar.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.edificar.DTO.response.TurmaResponse;
import com.app.edificar.DTO.response.UsuarioDadosResponse;
import com.app.edificar.service.UsuarioService;

@CrossOrigin("*")
@RestController
@RequestMapping("/professores")
public class ProfessoresController {
    private UsuarioService usuarioService;

    public ProfessoresController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDadosResponse>> listarProfessores(){
        return ResponseEntity.ok(this.usuarioService.retornarProfessores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDadosResponse> buscarProfessorPorId(@PathVariable("id") Long id){
        return ResponseEntity.ok(this.usuarioService.buscarProfessorPorId(id));
    }
    @GetMapping("/{id}/turmas")
    public ResponseEntity<List<TurmaResponse>> listarTurmasDeProfessor(@PathVariable("id") Long id){
        return ResponseEntity.ok(this.usuarioService.retornarTurmasDeUmProfessor(id));
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<List<UsuarioResponse>> listarAulasdeProfessor(@PathVariable("id") Long id){
//        return ResponseEntity.ok(this.usuarioService.retornarUsuarios());
//    }

}

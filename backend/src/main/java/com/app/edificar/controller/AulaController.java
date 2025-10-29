package com.app.edificar.controller;

import java.util.List;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.app.edificar.DTO.response.AulaResponse;
import com.app.edificar.service.AulaService;
import com.app.edificar.service.AuthenticationService;

@CrossOrigin("*")
@RestController
@RequestMapping("/aulas")
public class AulaController {

    private final AulaService aulaService;
    private final AuthenticationService authenticationService;

    public AulaController(AulaService aulaService, AuthenticationService authenticationService) {
        this.aulaService = aulaService;
        this.authenticationService = authenticationService;
    }

    
   @PutMapping("/{idAula}/iniciarAula")
   public ResponseEntity<AulaResponse> iniciarAula(@PathVariable("idAula")
   Long idAula){
       Long idProfessor = this.authenticationService.getIdUsuarioAutenticado();
       return ResponseEntity.ok(this.aulaService.iniciarAula(idProfessor,idAula));
   }

   @PutMapping("/{idAula}/finalizarAula")
   public ResponseEntity<AulaResponse> finalizarAula(@PathVariable("idAula")
                                                   Long idAula){
       Long idProfessor = this.authenticationService.getIdUsuarioAutenticado();
       return ResponseEntity.ok(this.aulaService.finalizarAula(idProfessor,idAula));
   }

   @GetMapping
   public ResponseEntity<List<AulaResponse>> listarAulas(){
       return ResponseEntity.ok(this.aulaService.listarAulas());
   }
}

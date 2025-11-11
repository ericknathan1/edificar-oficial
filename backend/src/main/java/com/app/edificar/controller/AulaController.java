package com.app.edificar.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.edificar.DTO.request.AulaRequest;
import com.app.edificar.DTO.request.AulaUpdateRequest;
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

    @PostMapping()
    public ResponseEntity<AulaResponse> salvarAula(@RequestBody AulaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.aulaService.salvarAula(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AulaResponse> reagendarAula(@PathVariable("id") Long id, @RequestBody AulaUpdateRequest request) {
        return ResponseEntity.ok(this.aulaService.reagendarAula(id, request));
    }

   @GetMapping("/{id}")
   public ResponseEntity<AulaResponse> retornarAulaPorId(@PathVariable("id") Long id){
       return ResponseEntity.ok(this.aulaService.aulaPorId(id));
   }

   @GetMapping
   public ResponseEntity<List<AulaResponse>> listarAulas(){
       return ResponseEntity.ok(this.aulaService.listarAulas());
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

   @DeleteMapping("/{idAula}")
    public ResponseEntity cancelarAula(@PathVariable("idAula") Long idAula){
        aulaService.apagarAula(idAula);
        return ResponseEntity.noContent().build();
   }
}

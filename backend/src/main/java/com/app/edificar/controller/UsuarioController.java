package com.app.edificar.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.edificar.DTO.request.UsuarioRequest;
import com.app.edificar.DTO.response.UsuarioResponse;
import com.app.edificar.DTO.security.LoginSecurityRequest;
import com.app.edificar.DTO.security.TokenSecurityResponse;
import com.app.edificar.DTO.security.UsuarioSecurityRequest;
import com.app.edificar.service.AuthenticationService;
import com.app.edificar.service.UsuarioService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private UsuarioService usuarioService;

    private AuthenticationService authenticationService;


    public UsuarioController(UsuarioService usuarioService, AuthenticationService authenticationService) {
        this.usuarioService = usuarioService;
        this.authenticationService = authenticationService;
    }

    @GetMapping 
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios(){
        return ResponseEntity.ok(this.usuarioService.retornarUsuarios());
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<UsuarioResponse>> listarUsuariosAtivos(){
        return ResponseEntity.ok(this.usuarioService.retornarUsuariosAtivos());
    }

    @GetMapping("/apagados")
    public ResponseEntity<List<UsuarioResponse>> listarUsuariosApagados(){
        return ResponseEntity.ok(this.usuarioService.retornarUsuariosApagados());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarUsuarioPorId(@PathVariable("id") Long id){
        return ResponseEntity.ok(this.usuarioService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarUsuarioPorId(@PathVariable("id") Long id,UsuarioRequest request){
        return ResponseEntity.ok(this.usuarioService.editarUsuario(id,request));
    }
 
    @DeleteMapping
    public ResponseEntity apagarUsuario(@PathVariable("id") Long id){
        this.usuarioService.apagarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<TokenSecurityResponse> logarUsuario(@Valid @RequestBody LoginSecurityRequest loginUsuarioDTO){
        TokenSecurityResponse token = usuarioService.authenticateUser(loginUsuarioDTO);
        return new ResponseEntity<>(token,HttpStatus.OK);
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Void> cadastroAdmin(@RequestBody @Valid UsuarioSecurityRequest request) {        
        this.usuarioService.criarUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    
    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> buscarPerfil(){
        return ResponseEntity.ok(this.authenticationService.getPerfilAutenticado());
    }

}

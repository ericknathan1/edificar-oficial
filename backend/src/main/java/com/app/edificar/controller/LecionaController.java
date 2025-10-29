package com.app.edificar.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.app.edificar.DTO.request.LecionaRequest;
import com.app.edificar.DTO.response.LecionaResponse;
import com.app.edificar.service.LecionaService;

@CrossOrigin("*")
@RestController
@RequestMapping("/lecionas")
public class LecionaController {
    private LecionaService service;

    public LecionaController(LecionaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<LecionaResponse>> retornarLecionas(){
        return ResponseEntity.ok(this.service.retornarLecionas());
    }

    @PostMapping
    public ResponseEntity<LecionaResponse> salvarLeciona(@RequestBody LecionaRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.service.criarLeciona(request));
    }
}

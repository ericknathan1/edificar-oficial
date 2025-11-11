package com.app.edificar.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.edificar.DTO.request.FrequenciaStatusRequest;
import com.app.edificar.DTO.response.FrequenciaMediaResponse;
import com.app.edificar.DTO.response.FrequenciaResponse;
import com.app.edificar.service.FrequenciaService;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/frequencias")
public class FrequenciaController {
    private FrequenciaService frequenciaService;

    public FrequenciaController(FrequenciaService frequenciaService) {
        this.frequenciaService = frequenciaService;
    }

    @PostMapping("/aplicarPresenca/{idAula}")
    public ResponseEntity<FrequenciaResponse> iniciarAula(@PathVariable("idAula")Long idAula, 
    @RequestBody FrequenciaStatusRequest request){
        return ResponseEntity.ok(this.frequenciaService.aplicarPresenca(idAula,request));
    }

    @GetMapping("/aula/{aulaId}")
    public ResponseEntity<List<FrequenciaResponse>> retornarFrequenciasPorAula(
            @PathVariable("aulaId") Long aulaId){
        List<FrequenciaResponse> responses = frequenciaService.frequenciaPorAula(aulaId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/aula/{aulaId}/media")
    public ResponseEntity<FrequenciaMediaResponse> retornarMediaPorAula(@PathVariable Long aulaId) {
        FrequenciaMediaResponse media = frequenciaService.calcularMediaFrequenciaPorAula(aulaId);
        return ResponseEntity.ok(media);
    }
}

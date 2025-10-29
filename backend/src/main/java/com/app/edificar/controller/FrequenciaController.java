package com.app.edificar.controller;



import com.app.edificar.DTO.request.FrequenciaStatusRequest;
import com.app.edificar.DTO.response.AulaResponse;
import com.app.edificar.DTO.response.FrequenciaResponse;
import com.app.edificar.service.FrequenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("*")
@RestController
@RequestMapping("/frequencias")
public class FrequenciaController {
    private FrequenciaService frequenciaService;

    public FrequenciaController(FrequenciaService frequenciaService) {
        this.frequenciaService = frequenciaService;
    }

    @PostMapping("/aplicarPresenca/{idAula}")
    public ResponseEntity<FrequenciaResponse> iniciarAula(@PathVariable("idAula")
    Long idAula, @RequestBody FrequenciaStatusRequest request){
        return ResponseEntity.ok(this.frequenciaService.aplicarPresenca(idAula,request));
    }
}

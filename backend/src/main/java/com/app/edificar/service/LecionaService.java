package com.app.edificar.service;

import com.app.edificar.DTO.request.LecionaRequest;
import com.app.edificar.DTO.response.LecionaResponse;
import com.app.edificar.entity.Leciona;
import com.app.edificar.entity.Turma;
import com.app.edificar.entity.Usuario;
import com.app.edificar.repository.LecionaRepository;
import com.app.edificar.repository.TurmaRepository;
import com.app.edificar.repository.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LecionaService {
    private ModelMapper modelMapper;
    private LecionaRepository lecionaRepository;
    private TurmaRepository turmaRepository;
    private UsuarioRepository usuarioRepository;

    public LecionaService(ModelMapper modelMapper, LecionaRepository lecionaRepository, TurmaRepository turmaRepository, UsuarioRepository usuarioRepository) {
        this.modelMapper = modelMapper;
        this.lecionaRepository = lecionaRepository;
        this.turmaRepository = turmaRepository;
        this.usuarioRepository = usuarioRepository;
    }

   public LecionaResponse criarLeciona(LecionaRequest request){
        Turma turma = modelMapper.map(this.turmaRepository.findById(request.getTurmaId()),Turma.class);
        Usuario usuario = modelMapper.map(this.usuarioRepository.findById(request.getUsuarioId()),Usuario.class);
        Leciona leciona = new Leciona();
        leciona.setTurma(turma);
        leciona.setUsuario(usuario);
        Leciona lecionaSalvo = this.lecionaRepository.save(leciona);
        return modelMapper.map(lecionaSalvo,LecionaResponse.class);
   }

   public List<LecionaResponse> retornarLecionas(){
        List<Leciona> lecionas = this.lecionaRepository.findAll();
        List<LecionaResponse> responses = lecionas.stream().map(leciona ->
                modelMapper.map(leciona,LecionaResponse.class)).collect(Collectors.toList());
        return responses;
   }

}

package com.app.edificar.service;

import com.app.edificar.DTO.request.FrequenciaStatusRequest;
import com.app.edificar.DTO.response.FrequenciaResponse;
import com.app.edificar.entity.*;
import com.app.edificar.enums.RoleName;
import com.app.edificar.enums.TipoUsuario;
import com.app.edificar.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FrequenciaService {
    private ModelMapper modelMapper;
    private FrequenciaRepository frequenciaRepository;
    private AulaRepository aulaRepository;
    private AlunoRepository alunoRepository;
    private UsuarioRepository usuarioRepository;
    private TurmaRepository turmaRepository;
    private LecionaRepository lecionaRepository;

    public FrequenciaService(ModelMapper modelMapper, FrequenciaRepository frequenciaRepository, AulaRepository aulaRepository, AlunoRepository alunoRepository, UsuarioRepository usuarioRepository, TurmaRepository turmaRepository, LecionaRepository lecionaRepository) {
        this.modelMapper = modelMapper;
        this.frequenciaRepository = frequenciaRepository;
        this.aulaRepository = aulaRepository;
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.turmaRepository = turmaRepository;
        this.lecionaRepository = lecionaRepository;
    }

    public FrequenciaResponse aplicarPresenca(Long aulaId, FrequenciaStatusRequest request){
        Aula aula = this.aulaRepository.aulaPorId(aulaId);
        Long professorId = request.getProfessorId();
        Long alunoId = request.getAlunoId();

        if (aula == null){
            throw new IllegalArgumentException("Aula não existe");
        }
        Usuario usuario = usuarioRepository.usuarioPorId(professorId);
        if (usuario.getRoles().stream().anyMatch(r -> r.getName().equals(RoleName.ROLE_PROFESSOR))){
            throw new IllegalArgumentException("O usuario selecionado não é um professor: "+professorId);
        }

        if (usuario.getId() != aula.getUsuario().getId()){
            throw new IllegalArgumentException("O usuario selecionado não está lecionando a aula selecionada: "+professorId);
        }

        Aluno aluno = this.alunoRepository.alunoPorId(alunoId);
        if (aluno == null){
            throw new IllegalArgumentException("Aluno não existe");
        }
        Frequencia frequenciaBuscada = this.frequenciaRepository.frequenciasPorAlunoEAula(alunoId, aulaId);
        if (frequenciaBuscada == null){
            throw new IllegalArgumentException("Aluno não é da turma da aula");
        }
        frequenciaBuscada.setStatus(request.getStatus());
        if(request.getJustificativa() != null){
            frequenciaBuscada.setJustificativa(request.getJustificativa());
        }

        Frequencia frequenciaAtualizada = frequenciaRepository.save(frequenciaBuscada);
        return modelMapper.map(frequenciaAtualizada, FrequenciaResponse.class);
    }
}

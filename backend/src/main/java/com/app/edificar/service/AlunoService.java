package com.app.edificar.service;

import com.app.edificar.DTO.request.AlunoRequest;
import com.app.edificar.DTO.response.*;
import com.app.edificar.entity.Aluno;
import com.app.edificar.entity.Aula;
import com.app.edificar.entity.Frequencia;
import com.app.edificar.entity.Turma;
import com.app.edificar.enums.StatusPadrao;
import com.app.edificar.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {
    private ModelMapper modelMapper;
    private AlunoRepository alunoRepository;
    private InscricaoRepository inscricaoRepository;
    private FrequenciaRepository frequenciaRepository;
    private AulaRepository aulaRepository;
    private LecionaRepository lecionaRepository;

    public AlunoService(ModelMapper modelMapper, AlunoRepository alunoRepository, InscricaoRepository inscricaoRepository, FrequenciaRepository frequenciaRepository, AulaRepository aulaRepository, LecionaRepository lecionaRepository) {
        this.modelMapper = modelMapper;
        this.alunoRepository = alunoRepository;
        this.inscricaoRepository = inscricaoRepository;
        this.frequenciaRepository = frequenciaRepository;
        this.aulaRepository = aulaRepository;
        this.lecionaRepository = lecionaRepository;
    }

    //POST '/alunos'
    public AlunoResponse salvarAluno(AlunoRequest request){
        Aluno aluno = modelMapper.map(request,Aluno.class);
        aluno.setStatus(StatusPadrao.ATIVO);
        aluno.setDataCriacao(LocalDate.now());
        Aluno alunoSalvo = this.alunoRepository.save(aluno);
        return modelMapper.map(alunoSalvo,AlunoResponse.class);
    }

    //GET '/alunos'
    public List<AlunoResponse> retornarAlunos(){
        List<Aluno> alunos = this.alunoRepository.findAll();
        List<AlunoResponse> responses = alunos.stream().map(
                aluno -> modelMapper.map(aluno,AlunoResponse.class)
        ).collect(Collectors.toList());
        return responses;
    }

    //GET '/alunos/{id}'
    public AlunoResponse retornarAluno(Long id){
        return modelMapper.map(this.alunoRepository.alunoPorId(id),AlunoResponse.class);
    }

    //PUT '/alunos/{id}'
    public AlunoResponse atualizarAluno(Long id, AlunoRequest request){
        Aluno alunoBuscado = this.alunoRepository.alunoPorId(id);
        if (alunoBuscado != null){
            modelMapper.map(request,alunoBuscado);
            Aluno alunoSalvo = this.alunoRepository.save(alunoBuscado);
            return modelMapper.map(alunoSalvo,AlunoResponse.class);
        }else {
            throw new IllegalArgumentException("O id("+id+") não existe");
        }
    }

    //DELETE '/alunos/{id}'
    public void apagarAluno(Long id){
        this.alunoRepository.apagarAluno(id);
    }

    public List<AlunoDadosResponse> retornarAlunosDados(){
        List<Aluno> alunos = this.alunoRepository.findAll();
        List<AlunoDadosResponse> responses = alunos.stream().map(
                aluno -> modelMapper.map(aluno,AlunoDadosResponse.class)
        ).collect(Collectors.toList());
        return responses;
    }

    //Operações de Relacionamentos

    //GET '/alunos/{id}/frequencias'
    public List<AlunoFrequenciaResponse> retornarFrequenciasPorAluno(Long alunoId){
        Aluno alunoBuscado= this.alunoRepository.alunoPorId(alunoId);
        if (alunoBuscado != null){
           List<Frequencia> frequencias = this.frequenciaRepository.frequenciasPorAlunoId(alunoId);
           List<AlunoFrequenciaResponse> responses = frequencias.stream().map(frequencia -> modelMapper.map(frequencia,AlunoFrequenciaResponse.class)).collect(Collectors.toList());
           return responses;
        }else{
            throw new IllegalArgumentException("Aluno buscado não existe");
        }
    }

    //GET '/alunos/{id}/turmas'
    public List<TurmaResponse> retornarTurmaPorAluno(Long alunoId){
        Aluno alunoBuscado= this.alunoRepository.alunoPorId(alunoId);
        if (alunoBuscado != null){
            List<Turma> turmas = this.inscricaoRepository.buscarTurmaPorAluno(alunoId);
            List<TurmaResponse> responses = turmas.stream().map(frequencia -> modelMapper.map(frequencia,TurmaResponse.class)).collect(Collectors.toList());
            return responses;
        }else{
            throw new IllegalArgumentException("Aluno buscado não existe");
        }
    }

}

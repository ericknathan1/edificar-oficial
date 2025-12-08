package com.app.edificar.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.app.edificar.DTO.request.FrequenciaStatusRequest;
import com.app.edificar.DTO.response.FrequenciaMediaResponse;
import com.app.edificar.DTO.response.FrequenciaResponse;
import com.app.edificar.entity.Aluno;
import com.app.edificar.entity.Aula;
import com.app.edificar.entity.Frequencia;
import com.app.edificar.entity.Usuario;
import com.app.edificar.enums.FrequenciaStatus;
import com.app.edificar.enums.RoleName;
import com.app.edificar.repository.AlunoRepository;
import com.app.edificar.repository.AulaRepository;
import com.app.edificar.repository.FrequenciaRepository;
import com.app.edificar.repository.LecionaRepository;
import com.app.edificar.repository.TurmaRepository;
import com.app.edificar.repository.UsuarioRepository;

@Service
public class FrequenciaService {
    private ModelMapper modelMapper;
    private FrequenciaRepository frequenciaRepository;
    private AulaRepository aulaRepository;
    private AlunoRepository alunoRepository;
    private UsuarioRepository usuarioRepository;
    private TurmaRepository turmaRepository;
    private LecionaRepository lecionaRepository;
    private AuthenticationService authenticationService;

    public FrequenciaService(ModelMapper modelMapper, FrequenciaRepository frequenciaRepository, AulaRepository aulaRepository, AlunoRepository alunoRepository, UsuarioRepository usuarioRepository, TurmaRepository turmaRepository, LecionaRepository lecionaRepository, AuthenticationService authenticationService) {
        this.modelMapper = modelMapper;
        this.frequenciaRepository = frequenciaRepository;
        this.aulaRepository = aulaRepository;
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.turmaRepository = turmaRepository;
        this.lecionaRepository = lecionaRepository;
        this.authenticationService = authenticationService;
    }

    public List<FrequenciaResponse> frequenciaPorAula(Long aulaId){
        List<Frequencia> frequencias = frequenciaRepository.frequenciasPorAulaId(aulaId);
        return frequencias.stream()
                .map(frequencia -> modelMapper.map(frequencia,FrequenciaResponse.class))
                .collect(Collectors.toList());
    }

    public FrequenciaResponse aplicarPresenca(Long aulaId, FrequenciaStatusRequest request){
        Aula aula = this.aulaRepository.aulaPorId(aulaId);
        Long professorId = authenticationService.getIdUsuarioAutenticado();
        Long alunoId = request.getAlunoId();

        if (aula == null){
            throw new IllegalArgumentException("Aula não existe");
        }
        Usuario usuario = usuarioRepository.usuarioPorId(professorId);
        if (usuario.getRoles().stream().noneMatch(r -> r.getName().equals(RoleName.ROLE_PROFESSOR))){
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

    public FrequenciaMediaResponse calcularMediaFrequenciaPorAula(Long aulaId) {
        // 1. Valida se a aula existe
        if (!aulaRepository.existsById(aulaId)) {
            throw new IllegalArgumentException("A aula requisitada (" + aulaId + ") não existe.");
        }

        // 2. Busca todas as frequências (registros de alunos) para esta aula
        List<Frequencia> frequenciasDaAula = frequenciaRepository.frequenciasPorAulaId(aulaId);

        // 3. Se a lista estiver vazia (aula sem chamada ou sem alunos), retorna 0
        if (frequenciasDaAula.isEmpty()) {
            return new FrequenciaMediaResponse(aulaId, 0, 0);
        }

        // 4. Calcula o total de alunos e o total de presentes
        long totalAlunos = frequenciasDaAula.size();
        
        long totalPresentes = frequenciasDaAula.stream()
                .filter(f -> f.getStatus() == FrequenciaStatus.PRESENTE)
                .count();

        // 5. Retorna o DTO com o cálculo
        return new FrequenciaMediaResponse(aulaId, totalAlunos, totalPresentes);
    }
}

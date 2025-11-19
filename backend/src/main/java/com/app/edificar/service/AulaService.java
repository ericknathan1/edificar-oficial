package com.app.edificar.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.app.edificar.DTO.request.AulaRequest;
import com.app.edificar.DTO.request.AulaUpdateRequest;
import com.app.edificar.DTO.response.AulaResponse;
import com.app.edificar.entity.Aluno;
import com.app.edificar.entity.Aula;
import com.app.edificar.entity.Frequencia;
import com.app.edificar.entity.Turma;
import com.app.edificar.entity.Usuario;
import com.app.edificar.enums.FrequenciaStatus;
import com.app.edificar.enums.RoleName;
import com.app.edificar.enums.StatusAula;
import com.app.edificar.repository.AlunoRepository;
import com.app.edificar.repository.AulaRepository;
import com.app.edificar.repository.FrequenciaRepository;
import com.app.edificar.repository.InscricaoRepository;
import com.app.edificar.repository.LecionaRepository;
import com.app.edificar.repository.TurmaRepository;
import com.app.edificar.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class AulaService {
    private AulaRepository aulaRepository;
    private UsuarioRepository usuarioRepository;
    private LecionaRepository lecionaRepository;
    private TurmaRepository turmaRepository;
    private AlunoRepository alunoRepository;
    private ModelMapper modelMapper;
    private FrequenciaRepository frequenciaRepository;
    private InscricaoRepository inscricaoRepository;


    public AulaService(AulaRepository aulaRepository, UsuarioRepository usuarioRepository,
            LecionaRepository lecionaRepository, TurmaRepository turmaRepository, AlunoRepository alunoRepository,
            ModelMapper modelMapper, FrequenciaRepository frequenciaRepository,
            InscricaoRepository inscricaoRepository) {
        this.aulaRepository = aulaRepository;
        this.usuarioRepository = usuarioRepository;
        this.lecionaRepository = lecionaRepository;
        this.turmaRepository = turmaRepository;
        this.alunoRepository = alunoRepository;
        this.modelMapper = modelMapper;
        this.frequenciaRepository = frequenciaRepository;
        this.inscricaoRepository = inscricaoRepository;
    }

    public AulaResponse salvarAula(AulaRequest request){
        Turma turma = turmaRepository.turmaPorId(request.getTurmaId());
        List<Aula> aulasDaTurma = aulaRepository.aulaPorTurmaId(turma.getId());
        boolean existeAula = aulasDaTurma.stream()
                .anyMatch(aula -> aula.getData() == request.getData());

        if (existeAula){
            throw new IllegalArgumentException("A data da aula requisitada ("
            +request.getData()+") já existe em uma aula agendada.");
        }

        if (turma == null){
            throw new IllegalArgumentException("Turma selecionada não existe" +
                    "(id: "+request.getTurmaId()+")");
        }

        Aula aula = modelMapper.map(request, Aula.class);
        aula.setTurma(turma);
        aula.setStatus(StatusAula.AGENDADA);

        if (request.getUsuarioId() != null){
            Usuario usuario = usuarioRepository.usuarioPorId(request.getUsuarioId());
            aula.setUsuario(usuario);
        }

        aulaRepository.save(aula);
        return modelMapper.map(aula,AulaResponse.class);
    }

   public AulaResponse reagendarAula(Long aulaId, AulaUpdateRequest request){
        // 1. Busca a aula ou lança exceção
        Aula aulaBuscada = aulaRepository.findById(aulaId)
                .orElseThrow(() -> new IllegalArgumentException("A aula requisitada (" + aulaId + ") não existe"));

        // 2. Valida o status
        if (aulaBuscada.getStatus() != StatusAula.AGENDADA ){
            throw new IllegalArgumentException("A aula requisitada ("
                    + aulaId + ") não pode ser editada, pois possui o status: " + aulaBuscada.getStatus());
        }

        // 3. Atualiza a Data (se fornecida)
        if (request.getData() != null) {
            Long turmaId = aulaBuscada.getTurma().getId();
            List<Aula> aulasDaTurma = aulaRepository.aulaPorTurmaId(turmaId);

            // 3a. Verifica se a data já existe em OUTRA aula desta turma
            boolean dataJaExisteEmOutraAula = aulasDaTurma.stream()
                    .anyMatch(aula ->
                        !aula.getId().equals(aulaId) && // Exclui a própria aula da verificação
                        aula.getData().equals(request.getData()) // Compara datas corretamente
                    );

            if (dataJaExisteEmOutraAula){
                throw new IllegalArgumentException("A data da aula requisitada ("
                        + request.getData() + ") já existe em outra aula agendada para esta turma.");
            }
            
            // 3b. Atualiza a data
            aulaBuscada.setData(request.getData());
        }

        // 4. Atualiza Tópico (se fornecido)
        if (request.getTopico() != null) {
            aulaBuscada.setTopico(request.getTopico());
        }

        // 5. Atualiza Visitantes (se fornecido)
        if (request.getVisitante() != null) {
            aulaBuscada.setVisitante(request.getVisitante()); // A entidade usa 'setVisitantes' (plural)
        }

        // 6. Atualiza Professor (se fornecido)
        if (request.getUsuarioId() != null){
            Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                    .orElseThrow(() -> new IllegalArgumentException("O professor (usuárioId: " + request.getUsuarioId() + ") não foi encontrado."));
            aulaBuscada.setUsuario(usuario);
        }

        // 7. Salva e retorna
        Aula aulaAtualizada = aulaRepository.save(aulaBuscada);
        return modelMapper.map(aulaAtualizada, AulaResponse.class);
    }


    public AulaResponse aulaPorId(Long aulaId){
        Aula aulaBuscada = this.aulaRepository.aulaPorId(aulaId);
        if (aulaBuscada == null){
            throw new IllegalArgumentException("A aula requisitada ("
                    +aulaId+") não existe");
        }
        return modelMapper.map(aulaBuscada,AulaResponse.class);
    }


    public void apagarAula(Long aulaId){
        Aula aulaBuscada = this.aulaRepository.aulaPorId(aulaId);
        if (aulaBuscada == null){
            throw new IllegalArgumentException("A aula requisitada ("
                    +aulaId+") não existe");
        }
        this.aulaRepository.apagarAula(aulaId);
    }

    public List<AulaResponse> listarAulas(){
    List<Aula> aulas = aulaRepository.findAll();
    return aulas.stream()
                .map(aula -> modelMapper.map(aula, AulaResponse.class))
                .toList();
    }

    
    //Lógicas de fluxos de aula
    @Transactional
    public AulaResponse iniciarAula(Long professorId, Long aulaId){
        Usuario professor = this.usuarioRepository.usuarioPorId(professorId);
        Aula aulaBuscada = this.aulaRepository.aulaPorId(aulaId);
        if (professor.getRoles().stream().noneMatch(r -> r.getName().equals(RoleName.ROLE_PROFESSOR))){
            throw new IllegalArgumentException("O usuario selecionado não é um professor: "+professorId);
        }
        boolean professorNaTurma = lecionaRepository.turmaProfessorExiste(aulaBuscada.getTurma().getId(),professor.getId()) > 0;
        if (!professorNaTurma){
            throw new IllegalArgumentException("O professor("+professor.getNome()+") selecionado não dá aula para a turma ("+aulaBuscada.getTurma().getNome()+")");
        }

       if (aulaBuscada.getData() != LocalDate.now()){
           throw new IllegalArgumentException("A aula ("+aulaBuscada.getId()+") não pode ser iniciada pois a data de hoje é diferente da data da aula.");
       }
       
        if (aulaBuscada.getStatus() != StatusAula.AGENDADA){
            throw new IllegalArgumentException("A aula ("+aulaBuscada.getId()+") não pode ser iniciada pois seu status é: "+aulaBuscada.getStatus());
        }
        aulaBuscada.setHoraInicio(LocalTime.now());
        aulaBuscada.setStatus(StatusAula.EM_ANDAMENTO);
        aulaBuscada.setUsuario(professor);
        Aula aulaIniciada = this.aulaRepository.save(aulaBuscada);
        return modelMapper.map(aulaIniciada,AulaResponse.class);
    }
    
    @Transactional
    public AulaResponse finalizarAula(Long professorId, Long aulaId){
        Usuario professor = this.usuarioRepository.usuarioPorId(professorId);
        Aula aulaBuscada = this.aulaRepository.aulaPorId(aulaId);

        // 1. Validações de Permissão
        validarProfessorDaTurma(professor, aulaBuscada);
        
        if (aulaBuscada.getUsuario() != null && !aulaBuscada.getUsuario().getId().equals(professor.getId())) {
             throw new IllegalArgumentException("Apenas o professor que iniciou a aula pode finalizá-la.");
        }

        // 2. Validação de Status
        if (aulaBuscada.getStatus() != StatusAula.EM_ANDAMENTO) {
            throw new IllegalArgumentException("A aula (" + aulaId + 
                ") não pode ser finalizada pois não está EM_ANDAMENTO.");
        }

        // 3. Tratamento Inteligente de Pendências (Melhoria de UX)
        // Ao invés de bloquear, vamos assumir que quem ficou como PENDENTE estava AUSENTE.
        List<Frequencia> frequencias = this.frequenciaRepository.frequenciasPorAulaId(aulaId);
        
        List<Frequencia> pendentes = frequencias.stream()
                .filter(f -> f.getStatus() == FrequenciaStatus.PENDENTE)
                .collect(Collectors.toList());

        if (!pendentes.isEmpty()) {
            // OPÇÃO A: Auto-completar com AUSENTE (Recomendado para facilitar)
            pendentes.forEach(f -> f.setStatus(FrequenciaStatus.AUSENTE));
            frequenciaRepository.saveAll(pendentes);
            
            // OPÇÃO B: Manter o bloqueio (Se a regra de negócio for rigorosa)
            // throw new IllegalArgumentException("Existem alunos com presença PENDENTE. Regularize antes de finalizar.");
        }

        // 4. Finalização
        aulaBuscada.setHoraFim(LocalTime.now());
        aulaBuscada.setStatus(StatusAula.FINALIZADA);
        
        Aula aulaFinalizada = this.aulaRepository.save(aulaBuscada);
        return modelMapper.map(aulaFinalizada, AulaResponse.class);
    }

    private void validarProfessorDaTurma(Usuario professor, Aula aula) {
        if (professor == null) throw new IllegalArgumentException("Professor não encontrado.");
        if (aula == null) throw new IllegalArgumentException("Aula não encontrada.");

        boolean isProfessor = professor.getRoles().stream()
                .anyMatch(r -> r.getName().equals(RoleName.ROLE_PROFESSOR));
        
        if (!isProfessor) {
            throw new IllegalArgumentException("O usuário selecionado não é um professor.");
        }

        Long professorNaTurma = lecionaRepository.turmaProfessorExiste(aula.getTurma().getId(), professor.getId());
        if (professorNaTurma == 0) { // Assumindo que retorna Count > 0
            throw new IllegalArgumentException("O professor selecionado não está vinculado a esta turma.");
        }
    }

    private void gerarListaDePresencaSeNaoExistir(Aula aula) {
        List<Frequencia> frequenciasExistentes = frequenciaRepository.frequenciasPorAulaId(aula.getId());
        
        if (frequenciasExistentes.isEmpty()) {
            // Busca todos os alunos inscritos na turma
            List<Aluno> alunosInscritos = inscricaoRepository.buscarAlunosPorTurma(aula.getTurma().getId());
            
            if (!alunosInscritos.isEmpty()) {
                List<Frequencia> novasFrequencias = new ArrayList<>();
                for (Aluno aluno : alunosInscritos) {
                    Frequencia f = new Frequencia();
                    f.setAula(aula);
                    f.setAluno(aluno);
                    f.setStatus(FrequenciaStatus.PENDENTE); // Status inicial
                    novasFrequencias.add(f);
                }
                frequenciaRepository.saveAll(novasFrequencias);
            }
        }
    }

    




}

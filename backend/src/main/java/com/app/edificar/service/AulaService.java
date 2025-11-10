package com.app.edificar.service;

import java.time.LocalTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.app.edificar.DTO.request.AulaRequest;
import com.app.edificar.DTO.request.AulaUpdateRequest;
import com.app.edificar.DTO.response.AulaResponse;
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
import com.app.edificar.repository.LecionaRepository;
import com.app.edificar.repository.TurmaRepository;
import com.app.edificar.repository.UsuarioRepository;

@Service
public class AulaService {
    private AulaRepository aulaRepository;
    private UsuarioRepository usuarioRepository;
    private LecionaRepository lecionaRepository;
    private TurmaRepository turmaRepository;
    private AlunoRepository alunoRepository;
    private ModelMapper modelMapper;
    private FrequenciaRepository frequenciaRepository;


    public AulaService(AulaRepository aulaRepository, UsuarioRepository usuarioRepository, LecionaRepository lecionaRepository, TurmaRepository turmaRepository, AlunoRepository alunoRepository, ModelMapper modelMapper, FrequenciaRepository frequenciaRepository) {
        this.aulaRepository = aulaRepository;
        this.usuarioRepository = usuarioRepository;
        this.lecionaRepository = lecionaRepository;
        this.turmaRepository = turmaRepository;
        this.alunoRepository = alunoRepository;
        this.modelMapper = modelMapper;
        this.frequenciaRepository = frequenciaRepository;
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
//        if (aulaBuscada.getData() != LocalDate.now()){
//            throw new IllegalArgumentException("A aula ("+aulaBuscada.getId()+") não pode ser iniciada pois a data de hoje é diferente da data da aula.");
//        }
        if (aulaBuscada.getStatus() != StatusAula.AGENDADA){
            throw new IllegalArgumentException("A aula ("+aulaBuscada.getId()+") não pode ser iniciada pois seu status é: "+aulaBuscada.getStatus());
        }
        aulaBuscada.setHoraInicio(LocalTime.now());
        aulaBuscada.setStatus(StatusAula.EM_ANDAMENTO);
        aulaBuscada.setUsuario(professor);
        Aula aulaIniciada = this.aulaRepository.save(aulaBuscada);
        return modelMapper.map(aulaIniciada,AulaResponse.class);
    }

    public AulaResponse finalizarAula(Long professorId, Long aulaId){
        Usuario professor = this.usuarioRepository.usuarioPorId(professorId);
        Aula aulaBuscada = this.aulaRepository.aulaPorId(aulaId);

        // 1. Validações de Usuário
        if (professor.getRoles().stream().noneMatch(r -> r.getName().equals(RoleName.ROLE_PROFESSOR))){
            throw new IllegalArgumentException("O usuário selecionado não é um professor: "+professorId);
        }
        if (aulaBuscada.getUsuario().getId() != professor.getId()){
            throw new IllegalArgumentException("O usuário selecionado não está lecionando esta aula.");
        }

        // 2. Validação de Status (DEVE ESTAR EM ANDAMENTO PARA SER FINALIZADA)
        // Corrigindo a mensagem de erro para refletir a ação correta.
        if (aulaBuscada.getStatus() != StatusAula.EM_ANDAMENTO){
            throw new IllegalArgumentException("A aula ("+aulaBuscada.getId()+") não pode ser finalizada pois seu status é: "+aulaBuscada.getStatus());
        }

        // 3. Validação de Pré-Requisitos (Pendências)
        List<Frequencia> frequencias = this.frequenciaRepository.frequenciasPorAulaId(aulaId);
        boolean haPendencias = frequencias.stream()
                .anyMatch(frequencia -> frequencia.getStatus() == FrequenciaStatus.PENDENTE);

        if (haPendencias) {
            // Se houver pendências, o método para AQUI.
            throw new IllegalArgumentException("Ainda há presenças pendentes! A aula não pode ser finalizada.");
        }

        // 4. Execução e Persistência (Só chega aqui se todas as validações passarem)
        aulaBuscada.setHoraFim(LocalTime.now());
        aulaBuscada.setStatus(StatusAula.FINALIZADA);
        Aula aulaFinalizada = this.aulaRepository.save(aulaBuscada);

        return modelMapper.map(aulaFinalizada, AulaResponse.class);
    }



    




}

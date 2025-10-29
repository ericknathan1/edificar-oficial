package com.app.edificar.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.app.edificar.DTO.request.TurmaRequest;
import com.app.edificar.DTO.request.TurmaStatusRequest;
import com.app.edificar.DTO.response.AlunoDadosResponse;
import com.app.edificar.DTO.response.AulaResponse;
import com.app.edificar.DTO.response.InscricaoResponse;
import com.app.edificar.DTO.response.LecionaResponse;
import com.app.edificar.DTO.response.TurmaResponse;
import com.app.edificar.DTO.response.UsuarioDadosResponse;
import com.app.edificar.entity.Aluno;
import com.app.edificar.entity.Aula;
import com.app.edificar.entity.Inscricao;
import com.app.edificar.entity.Leciona;
import com.app.edificar.entity.Turma;
import com.app.edificar.entity.Usuario;
import com.app.edificar.enums.RoleName;
import com.app.edificar.enums.StatusPadrao;
import com.app.edificar.repository.AlunoRepository;
import com.app.edificar.repository.AulaRepository;
import com.app.edificar.repository.InscricaoRepository;
import com.app.edificar.repository.LecionaRepository;
import com.app.edificar.repository.TurmaRepository;
import com.app.edificar.repository.UsuarioRepository;

@Service
public class TurmaService {

    private ModelMapper modelMapper;
    private TurmaRepository turmaRepository;
    private LecionaRepository lecionaRepository;
    private UsuarioRepository usuarioRepository;
    private AgendaService agendaService;
    private AlunoRepository alunoRepository;
    private InscricaoRepository inscricaoRepository;

    private AulaRepository aulaRepository;

    public TurmaService(ModelMapper modelMapper, TurmaRepository turmaRepository, LecionaRepository lecionaRepository, UsuarioRepository usuarioRepository, AgendaService agendaService, AlunoRepository alunoRepository, InscricaoRepository inscricaoRepository, AulaRepository aulaRepository) {
        this.modelMapper = modelMapper;
        this.turmaRepository = turmaRepository;
        this.lecionaRepository = lecionaRepository;
        this.usuarioRepository = usuarioRepository;
        this.agendaService = agendaService;
        this.alunoRepository = alunoRepository;
        this.inscricaoRepository = inscricaoRepository;
        this.aulaRepository = aulaRepository;
    }

    //Operações CRUD

    // POST '/turmas'
    public TurmaResponse salvarTurma(TurmaRequest turmaRequest){
        Turma turma = modelMapper.map(turmaRequest,Turma.class);
        turma.setStatus(StatusPadrao.ATIVO);
        Turma turmaSalva = this.turmaRepository.save(turma);
        this.agendaService.AgendarAulaCriacao(turmaSalva);
        return modelMapper.map(turmaSalva,TurmaResponse.class);
    }

    // POST '/turmas' sem geração de aulas automaticas
    public TurmaResponse salvarTurmaSemAulas(TurmaRequest turmaRequest){
        Turma turma = modelMapper.map(turmaRequest,Turma.class);
        turma.setStatus(StatusPadrao.ATIVO);
        Turma turmaSalva = this.turmaRepository.save(turma);
        return modelMapper.map(turmaSalva,TurmaResponse.class);
    }

    // PUT '/turmas/{id}'
    public TurmaResponse mudarTurma(Long id, TurmaRequest request){
        Turma turmaBuscada = this.turmaRepository.turmaPorId(id);
        if (turmaBuscada != null){
            modelMapper.map(request,turmaBuscada);
            Turma turmaSalva = this.turmaRepository.save(turmaBuscada);
            return modelMapper.map(turmaSalva,TurmaResponse.class);
        }else{
            throw new IllegalArgumentException("Id da Turma não existe");
        }
    }

    // PATCH '/turmas/{id}'
    public TurmaResponse mudarStatusTurma(Long id, TurmaStatusRequest request){
        Turma turmaBuscada = this.turmaRepository.turmaPorId(id);
        if (turmaBuscada != null){
            turmaBuscada.setStatus(request.getStatus());
            Turma turmaSalva = this.turmaRepository.save(turmaBuscada);
            return modelMapper.map(turmaSalva,TurmaResponse.class);
        }else{
            throw new IllegalArgumentException("Id da Turma não existe");
        }
    }

    public TurmaResponse turmaPorId(Long id){
        return modelMapper.map(this.turmaRepository.turmaPorId(id),TurmaResponse.class);
    }

    // GET '/turmas'
    public List<TurmaResponse> retornarTurmas(){
        List<Turma> turmas = this.turmaRepository.findAll();
        List<TurmaResponse> responseList = turmas.stream().map(
                turma -> modelMapper.map(turma,TurmaResponse.class)
        ).collect(Collectors.toList());
        return responseList;
    }

    //DELETE '/turmas/{id}'
    public void apagarTurma(Long id){
        this.turmaRepository.apagarTurma(id);
    }

    //Operações de associação

    // POST '/turmas/{id}/professores/{id}'
    public LecionaResponse salvarProfessorNaTurma(Long idTurma, Long idUsuario){
        Turma turmaBuscada = this.turmaRepository.turmaPorId(idTurma);
        Usuario usuarioBuscado = this.usuarioRepository.usuarioPorId(idUsuario);
        if (turmaBuscada != null && usuarioBuscado != null){
            if (usuarioBuscado.getRoles().stream().anyMatch(r -> r.getName().equals(RoleName.ROLE_PROFESSOR))){
                Leciona novaAssociacao = new Leciona();
                novaAssociacao.setUsuario(usuarioBuscado);
                novaAssociacao.setTurma(turmaBuscada);
                Leciona lecionaSalvo = this.lecionaRepository.save(novaAssociacao);
                return modelMapper.map(lecionaSalvo,LecionaResponse.class);
            }else{
             throw new IllegalArgumentException("Usuario("+idUsuario+")selecionado não é um Professor");
            }
        }else{
            throw new IllegalArgumentException("Professor("+idUsuario+") ou Turma ("
            +idTurma+") não existe.");
        }
    }

    // POST '/turmas/{id}/alunos/{id}
    public InscricaoResponse salvarAlunoNaTurma(Long idTurma, Long idAluno){
        Turma turmaBuscada = this.turmaRepository.turmaPorId(idTurma);
        Aluno alunoBuscado =  this.alunoRepository.alunoPorId(idAluno);
        if (turmaBuscada != null && alunoBuscado != null){
            Inscricao novaInscricao = new Inscricao();
            novaInscricao.setAluno(alunoBuscado);
            novaInscricao.setTurma(turmaBuscada);
            Inscricao inscricaoSalva = this.inscricaoRepository.save(novaInscricao);
            agendaService.AgendarFrequenciaPorInscricao(idTurma,idAluno);
            return modelMapper.map(inscricaoSalva,InscricaoResponse.class);
        }else{
            throw new IllegalArgumentException("Aluno("+idAluno+") ou Turma ("
                    +idTurma+") não existe.");
        }
    }

    // GET '/turmas/{idTurma}/professores
    public List<UsuarioDadosResponse> professoresEmUmaTurma(Long idTurma){
        List<Usuario> professoresBuscados = this.lecionaRepository.usuarioPorTurmaId(idTurma);
        List<UsuarioDadosResponse> responses = professoresBuscados.stream().map(
                usuario -> modelMapper.map(usuario,UsuarioDadosResponse.class))
                .collect(Collectors.toList());
        return responses;
    }

    // GET '/turmas/{idTurma}/alunos
    public List<AlunoDadosResponse> alunosEmUmaTurma(Long idTurma){
        List<Aluno> alunosBuscados = this.inscricaoRepository.buscarAlunosPorTurma(idTurma);
        List<AlunoDadosResponse> responses = alunosBuscados.stream().map(
                        usuario -> modelMapper.map(usuario,AlunoDadosResponse.class))
                .collect(Collectors.toList());
        return responses;
    }

    // GET '/turmas/{idTurma}/aulas

    public List<AulaResponse> aulasEmUmaTurma(Long idTurma){
        List<Aula> aulasBuscadas = this.aulaRepository.aulaPorTurmaId(idTurma);
        List<AulaResponse> responses = aulasBuscadas.stream().map(aula -> modelMapper.map(aula,AulaResponse.class)).
                collect(Collectors.toList());
        return responses;
    }
}

package com.app.edificar.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.app.edificar.DTO.request.UsuarioRequest;
import com.app.edificar.DTO.request.UsuarioStatusRequest;
import com.app.edificar.DTO.response.TurmaResponse;
import com.app.edificar.DTO.response.UsuarioDadosResponse;
import com.app.edificar.DTO.response.UsuarioResponse;
import com.app.edificar.DTO.security.LoginSecurityRequest;
import com.app.edificar.DTO.security.TokenSecurityResponse;
import com.app.edificar.DTO.security.UsuarioSecurityRequest;
import com.app.edificar.config.SecurityConfig;
import com.app.edificar.entity.Role;
import com.app.edificar.entity.Turma;
import com.app.edificar.entity.Usuario;
import com.app.edificar.enums.RoleName;
import com.app.edificar.enums.StatusUsuario;
import com.app.edificar.repository.AulaRepository;
import com.app.edificar.repository.LecionaRepository;
import com.app.edificar.repository.UsuarioRepository;

@Service
public class UsuarioService {
    private UsuarioRepository usuarioRepository;
    @Autowired
    private final ModelMapper modelMapper;
    private LecionaRepository lecionaRepository;
    private AulaRepository aulaRepository;


     @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private SecurityConfig securityConfiguration;

    @Autowired
    private RoleService roleService;

    public UsuarioService(ModelMapper modelMapper, UsuarioRepository usuarioRepository, LecionaRepository lecionaRepository, AulaRepository aulaRepository) {
        this.modelMapper = modelMapper;
        this.usuarioRepository = usuarioRepository;
        this.lecionaRepository = lecionaRepository;
        this.aulaRepository = aulaRepository;
    }

    public TokenSecurityResponse authenticateUser(LoginSecurityRequest loginRequest) {
        // Cria um objeto de autenticação com o email e a senha do usuário
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha());

        // Autentica o usuário com as credenciais fornecidas
        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);

        // Obtém o objeto UserDetails do usuário autenticado
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Gera um token JWT para o usuário autenticado
        return new TokenSecurityResponse(jwtTokenService.generateToken(userDetails));
    }

    public void criarUsuario(UsuarioSecurityRequest request){
        Usuario usuario = modelMapper.map(request,Usuario.class);
        usuario.setSenhaHash(securityConfiguration.passwordEncoder().encode(request.getSenha()));
        usuario.setStatus(StatusUsuario.ATIVO);
        usuario.setDataCriacao(LocalDate.now());
        List<Role> roles = roleService.getRolesByName(request.getRoles());
        usuario.setRoles(roles);
        this.usuarioRepository.save(usuario);
    }


    public UsuarioResponse salvarUsuario(UsuarioRequest usuarioRequest){
        Usuario usuario = modelMapper.map(usuarioRequest,Usuario.class);
        usuario.setStatus(StatusUsuario.ATIVO);
        usuario.setDataCriacao(LocalDate.now());
        Usuario usuarioSalvo = this.usuarioRepository.save(usuario);
        UsuarioResponse usuarioResponse = modelMapper.map(usuarioSalvo,UsuarioResponse.class);
        return usuarioResponse;
    }

    public UsuarioResponse buscarPorId(Long id){
        Usuario usuarioBuscado = this.usuarioRepository.usuarioPorId(id);
        UsuarioResponse response = modelMapper.map(usuarioBuscado,UsuarioResponse.class);
        List<Role> usuarioRoles = usuarioBuscado.getRoles();
            List<RoleName> roleNames = usuarioRoles.stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
            response.setRoles(roleNames);
            return response;
    }


    public UsuarioDadosResponse buscarProfessorPorId(Long id){
        return modelMapper.map(this.usuarioRepository.professorPorId(id),UsuarioDadosResponse.class);
    }

    public UsuarioResponse editarUsuario(Long id, UsuarioRequest request){
        Usuario usuarioBuscado = this.usuarioRepository.usuarioPorId(id);
        if (usuarioBuscado != null){
            modelMapper.map(request,usuarioBuscado);
            Usuario usuarioSalvo = this.usuarioRepository.save(usuarioBuscado);
            return modelMapper.map(usuarioSalvo,UsuarioResponse.class);
        }else{
            throw new IllegalArgumentException("Usuario com id("+id+")buscado não existe");
        }
    }

    public UsuarioDadosResponse atualizarStatus(Long id, UsuarioStatusRequest request){
        Usuario usuarioBuscado = this.usuarioRepository.usuarioPorId(id);
        if (usuarioBuscado != null){
            usuarioBuscado.setStatus(request.getStatus());
            return modelMapper.map(usuarioBuscado,UsuarioDadosResponse.class);
        }else{
            throw new IllegalArgumentException("Usuario com id("+id+")buscado não existe");
        }
    }

    public void apagarUsuario(Long id){
        this.usuarioRepository.apagarUsuario(id);
    }

    //Listagem de usuários

    public List<UsuarioResponse> retornarUsuarios(){
        List<Usuario> usuarios = this.usuarioRepository.usuarios();
        List<UsuarioResponse> usuarioResponses = new ArrayList<>();
        
        for(Usuario usuario : usuarios){
            UsuarioResponse response = modelMapper.map(usuario, UsuarioResponse.class);
            List<Role> usuarioRoles = usuario.getRoles();
            List<RoleName> roleNames = usuarioRoles.stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
            response.setRoles(roleNames);
            usuarioResponses.add(response);
        }
        return usuarioResponses;
    }

    public List<UsuarioResponse> retornarUsuariosAtivos(){
        List<Usuario> usuarios = this.usuarioRepository.usuariosAtivos();
        List<UsuarioResponse> usuarioResponses = new ArrayList<>();
        for(Usuario usuario : usuarios){
            UsuarioResponse response = modelMapper.map(usuario, UsuarioResponse.class);
            List<Role> usuarioRoles = usuario.getRoles();
            List<RoleName> roleNames = usuarioRoles.stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
            response.setRoles(roleNames);
            usuarioResponses.add(response);
        }
        return usuarioResponses;
    }

    public List<UsuarioDadosResponse> retornarProfessores(){
        List<Usuario> usuarios = this.usuarioRepository.professores();
        List<UsuarioDadosResponse> responses = usuarios.stream()
                .map(usuario -> modelMapper.map(usuario,UsuarioDadosResponse.class))
                .collect(Collectors.toList());
        return responses;
    }

    public List<UsuarioDadosResponse> retornarAdmnistradores(){
        List<Usuario> usuarios = this.usuarioRepository.admnistradores();
        List<UsuarioDadosResponse> responses = usuarios.stream()
                .map(usuario -> modelMapper.map(usuario,UsuarioDadosResponse.class))
                .collect(Collectors.toList());
        return responses;
    }

    public List<UsuarioResponse> retornarUsuariosApagados(){
        List<Usuario> usuarios = this.usuarioRepository.usuariosApagado();
        List<UsuarioResponse> usuarioResponses = new ArrayList<>();
        for(Usuario usuario : usuarios){
            UsuarioResponse response = modelMapper.map(usuario, UsuarioResponse.class);
            List<Role> usuarioRoles = usuario.getRoles();
            List<RoleName> roleNames = usuarioRoles.stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
            response.setRoles(roleNames);
            usuarioResponses.add(response);
        }
        return usuarioResponses;
    }

    public List<TurmaResponse> retornarTurmasDeUmProfessor(Long id){
        List<Turma> turmasBuscadas = this.lecionaRepository.turmasPorProfessorId(id);
        List<TurmaResponse> responses = turmasBuscadas.stream().map(turma -> modelMapper.map(
                turma, TurmaResponse.class
        )).collect(Collectors.toList());
        return responses;
    }






}

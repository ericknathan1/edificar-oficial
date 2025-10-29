package com.app.edificar.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.app.edificar.DTO.response.UsuarioResponse;
import com.app.edificar.entity.Role;
import com.app.edificar.entity.Usuario;
import com.app.edificar.enums.RoleName;
import com.app.edificar.repository.UsuarioRepository;

@Service
public class AuthenticationService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ModelMapper modelMapper;
    public UserDetailsImpl getUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            throw new IllegalStateException("Nenhum usuário autenticado encontrado no contexto de segurança.");
        }

        Object principal = authentication.getPrincipal();
        String idString = principal.toString();
        Long id = Long.parseLong(idString);

        Usuario usuario = usuarioRepository.usuarioPorId(id);
        UserDetailsImpl details = new UserDetailsImpl(usuario);
        return details;
    }

    public Long getIdUsuarioAutenticado() {
        // Chamamos o método acima para garantir que a validação seja feita.
        return this.getUsuarioAutenticado().getId();
    }

    public UsuarioResponse getPerfilAutenticado(){
        Usuario usuario = usuarioRepository.usuarioPorId(this.getIdUsuarioAutenticado());
        UsuarioResponse response = modelMapper.map(usuario, UsuarioResponse.class);
            List<Role> usuarioRoles = usuario.getRoles();
            List<RoleName> roleNames = usuarioRoles.stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
            response.setRoles(roleNames);
        return response;
    }
}

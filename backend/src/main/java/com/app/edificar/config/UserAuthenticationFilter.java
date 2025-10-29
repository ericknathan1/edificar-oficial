package com.app.edificar.config;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.app.edificar.entity.Usuario;
import com.app.edificar.repository.UsuarioRepository;
import com.app.edificar.service.JwtTokenService;
import com.app.edificar.service.UserDetailsImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class UserAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtTokenService jwtTokenService; // Service que definimos anteriormente

    @Autowired
    private UsuarioRepository usuarioRepository; // Repository que definimos anteriormente

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Verifica se o endpoint requer autenticação antes de processar a requisição
        if (checkIfEndpointIsNotPublic(request)) {
            String token = recoveryToken(request); // Recupera o token do cabeçalho Authorization da requisição
            if (token != null) {
                String subject = jwtTokenService.getSubjectFromToken(token);
                Long id = Long.parseLong(subject);// Obtém o assunto (neste caso, o nome de usuário) do token
                Usuario usuario = usuarioRepository.usuarioPorId(id); // Busca o usuário pelo email (que é o assunto do token)
                UserDetailsImpl userDetails = new UserDetailsImpl(usuario); // Cria um UserDetails com o usuário encontrado

                // Cria um objeto de autenticação do Spring Security
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(userDetails.getId(), null, userDetails.getAuthorities());

                // Define o objeto de autenticação no contexto de segurança do Spring Security
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                throw new RuntimeException("O token está ausente.");
            }
        }
        filterChain.doFilter(request, response); // Continua o processamento da requisição
    }

    // Recupera o token do cabeçalho Authorization da requisição
    private String recoveryToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            return authorizationHeader.replace("Bearer ", "");
        }
        return null;
    }

    // Verifica se o endpoint requer autenticação antes de processar a requisição
    private boolean checkIfEndpointIsNotPublic(HttpServletRequest request) {
        //ajustado para funcionamento do swagger
        String requestURI = request.getRequestURI();
        return Arrays.stream(SecurityConfig.ENDPOINTS_PADRAO).noneMatch(publicEndpoint ->
                requestURI.startsWith(publicEndpoint.replace("/**", "")) // suporta wildcard
        );
    }
}

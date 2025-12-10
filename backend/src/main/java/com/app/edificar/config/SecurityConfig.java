package com.app.edificar.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

   @Autowired
   private UserAuthenticationFilter userAuthenticationFilter;

   public static final String [] ENDPOINTS_PADRAO = {
    "/usuarios/login",
    "/usuarios/cadastro",
    "/index.html",
    "/imgs/**",
    "/favicon.ico",
    "/h2-console",
    // 🔓 Swagger/OpenAPI UI
    "/v3/api-docs/**",
    "/swagger-ui/**",
    "/swagger-ui.html",
    "/home",
    "/style",
    "/layout.css"
   };

   public static final String[] ENDPOINTS_PROFESSOR = {
            // Alunos
            "/alunos",
            "/alunos/ativos",
            "/alunos/apagados",
            "/alunos/{id}",
            "/alunos/{id}/frequencias",
            "/alunos/{id}/turmas",
            
            // Aulas
            "/aulas",
            "/aulas/{id}",
            "/aulas/{idAula}/iniciarAula",
            "/aulas/{idAula}/finalizarAula",
            
            // Frequencias
            "/frequencias/aplicarPresenca/{idAula}",
            "/frequencias/aula/{aulaId}",
            "/frequencias/aula/{aulaId}/media",
            
            // Lecionas (Associações)
            "/lecionas",
            
            // Professores
            "/professores",
            "/professores/{id}",
            "/professores/{id}/turmas",
            
            // Turmas
            "/turmas",
            "/turmas/semAulas",
            "/turmas/{id}",
            "/turmas/apagadas",
            "/turmas/ativas",
            "/turmas/{idTurma}/professores/{idProfessor}",
            "/turmas/{idTurma}/aluno/{idAluno}",
            "/turmas/{idTurma}/professores",
            "/turmas/{idTurma}/alunos",
            "/turmas/{idTurma}/aulas",
            
            // Usuarios
            "/usuarios",
            "/usuarios/ativos",
            "/usuarios/apagados",
            "/usuarios/{id}",
            "/usuarios/perfil"
    };

    public static final String[] ENDPOINTS_ADMIN = {
            // Alunos
            "/alunos",
            "/alunos/ativos",
            "/alunos/apagados",
            "/alunos/{id}",
            "/alunos/{id}/frequencias",
            "/alunos/{id}/turmas",

            // Aulas
            "/aulas",
            "/aulas/{id}",
            "/aulas/{idAula}/iniciarAula",
            "/aulas/{idAula}/finalizarAula",

            // Frequencias
            "/frequencias/aplicarPresenca/{idAula}",
            "/frequencias/aula/{aulaId}",
            "/frequencias/aula/{aulaId}/media",

            // Lecionas (Associações)
            "/lecionas",

            // Professores
            "/professores",
            "/professores/{id}",
            "/professores/{id}/turmas",

            // Turmas
            "/turmas",
            "/turmas/semAulas",
            "/turmas/{id}",
            "/turmas/apagadas",
            "/turmas/ativas",
            "/turmas/{idTurma}/professores/{idProfessor}",
            "/turmas/{idTurma}/aluno/{idAluno}",
            "/turmas/{idTurma}/professores",
            "/turmas/{idTurma}/alunos",
            "/turmas/{idTurma}/aulas",

            // Usuarios
            "/usuarios",
            "/usuarios/ativos",
            "/usuarios/apagados",
            "/usuarios/{id}",
            "/usuarios/perfil"
    };

   @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(ENDPOINTS_PADRAO).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(ENDPOINTS_PROFESSOR).hasAnyRole("PROFESSOR", "ADMINISTRADOR")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(userAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

package com.app.edificar.config;


import java.util.Arrays;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

   @Autowired
   private UserAuthenticationFilter userAuthenticationFilter;

   public static final String [] ENDPOINTS_PADRAO = {
    "/usuarios/login",
    "/usuarios/cadastro",
    "/web/download/app",
    "/h2-console",
    // 🔓 Swagger/OpenAPI UI
    "/v3/api-docs/**",
    "/swagger-ui/**",
    "/swagger-ui.html"
   };

   public static final String [] ENDPOINTS_PROFESSOR = {
           "/usuarios/**",
           "/professores/**",
           "/lecionas/**",
           "/turmas/**",
           "/alunos/**",
           "/aulas/**",
           "/frequencias/**"
   };

   public static final String [] ENDPOINTS_ADMIN = {
    "/usuarios/**",
    "/professores/**",
    "/lecionas/**",
    "/turmas/**",
    "/alunos/**",
    "/aulas/**",
    "/frequencias/**"
   };

   @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite as origens do seu app React Native
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:8081", 
            "http://26.123.223.30:8081" 
            // Adicione outras origens se necessário
        ));
        
        // Quais métodos HTTP são permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Quais cabeçalhos são permitidos (IMPORTANTE: inclua "Authorization")
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        
        // Permite credenciais (necessário para cabeçalhos customizados)
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuração para TODAS as rotas ("/**")
        source.registerCorsConfiguration("/**", configuration); 
        return source;
    }

   @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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

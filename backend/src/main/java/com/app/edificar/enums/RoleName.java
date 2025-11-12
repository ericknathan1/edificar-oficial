package com.app.edificar.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RoleName {
    ROLE_ADMINISTRADOR,
    ROLE_PROFESSOR;

    /**
     * Define como o enum será escrito no JSON.
     * Ex: ROLE_ADMINISTRADOR se torna "ADMINISTRADOR"
     */
    @JsonValue
    public String getSimpleName() {
        // Retorna o nome do enum, mas sem o prefixo "ROLE_"
        return this.name().replace("ROLE_", "");
    }

    /**
     * Define como o JSON será lido e convertido para o enum.
     * Permite que a API aceite "ADMINISTRADOR" ou "ROLE_ADMINISTRADOR".
     */
    @JsonCreator
    public static RoleName fromString(String value) {
        if (value == null) {
            return null;
        }
        
        String roleName = value.toUpperCase();
        
        // Se o valor não começar com "ROLE_", adiciona o prefixo
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        try {
            // Tenta encontrar o enum correspondente
            return RoleName.valueOf(roleName);
        } catch (IllegalArgumentException e) {
            // Se não encontrar, lança uma exceção (ou retorna null, dependendo da regra)
            throw new IllegalArgumentException(value + " não é um RoleName válido.");
        }
    }
}
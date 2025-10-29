package com.app.edificar.DTO.security;

public class TokenSecurityResponse {

    private String token;

    
    public TokenSecurityResponse(String token) {
        this.token = token;
    }

    
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

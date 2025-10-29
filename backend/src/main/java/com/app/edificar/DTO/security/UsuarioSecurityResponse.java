package com.app.edificar.DTO.security;

import com.app.edificar.enums.RoleName;

public class UsuarioSecurityResponse {
    private Long id;
    private String email;
    private RoleName roleName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public RoleName getRoleName() {
        return roleName;
    }

    public void setRoleName(RoleName roleName) {
        this.roleName = roleName;
    }
}

package com.app.edificar.service;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.app.edificar.entity.Usuario;

public class UserDetailsImpl implements UserDetails{
    private Usuario usuario;

    public UserDetailsImpl(Usuario usuario){
        this.usuario = usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return usuario.getRoles()
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());
    }

    public Long getId() {
        return this.usuario.getId();
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    @Override
    public String getPassword() {
        return usuario.getSenhaHash();
    }
    @Override
    public String getUsername() {
        return usuario.getEmail();
    }
}

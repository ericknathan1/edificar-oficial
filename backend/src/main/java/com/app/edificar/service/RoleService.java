package com.app.edificar.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.edificar.entity.Role;
import com.app.edificar.enums.RoleName;
import com.app.edificar.repository.RoleRepository;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getRolesByName(List<RoleName> roleNames){
        List<Role> roles = new ArrayList<>();
        for(RoleName roleName : roleNames){
            Role role = roleRepository.findByName(roleName);
            if(role == null){
                throw new RuntimeException("Role not found: " + roleName);
            }
            roles.add(role);
        }
        return roles;
    }
}

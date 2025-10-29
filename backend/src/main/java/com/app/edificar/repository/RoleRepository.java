package com.app.edificar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.edificar.entity.Role;
import com.app.edificar.enums.RoleName;

@Repository
public interface RoleRepository extends JpaRepository<Role,Long>{
    Role findByName(RoleName name);
}

package com.app.edificar.config;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.app.edificar.DTO.response.UsuarioResponse;
import com.app.edificar.entity.Role;
import com.app.edificar.entity.Usuario;
import com.app.edificar.enums.RoleName;

@Configuration
public class ModelMapperConfig {
   @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // --- INÍCIO DA CORREÇÃO ---

        // 1. Criar um conversor de List<Role> para List<RoleName>
        Converter<List<Role>, List<RoleName>> roleListToRoleNameListConverter = new Converter<List<Role>, List<RoleName>>() {
            @Override
            public List<RoleName> convert(MappingContext<List<Role>, List<RoleName>> context) {
                if (context.getSource() == null) {
                    return null;
                }
                // Para cada objeto Role na lista, pegue o campo 'nome' (que é um RoleName)
                return context.getSource().stream()
                        .map(Role::getName) // Mapeia cada Role para seu RoleName
                        .collect(Collectors.toList());
            }
        };

        // 2. Adicionar o mapeamento customizado para a classe Usuario -> UsuarioResponse
        modelMapper.typeMap(Usuario.class, UsuarioResponse.class).addMappings(mapper -> {
            // Mapeia o campo 'roles' (List<Role>) para 'roles' (List<RoleName>) usando o conversor
            mapper.using(roleListToRoleNameListConverter)
                  .map(Usuario::getRoles, UsuarioResponse::setRoles);
        });

        // --- FIM DA CORREÇÃO ---

        return modelMapper;
    }
}

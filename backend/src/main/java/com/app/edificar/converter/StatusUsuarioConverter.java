package com.app.edificar.converter;

import com.app.edificar.enums.StatusUsuario;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import jdk.jshell.Snippet;

@Converter(autoApply = true)
public class StatusUsuarioConverter implements AttributeConverter<StatusUsuario,Integer> {

    @Override
    public Integer convertToDatabaseColumn(StatusUsuario status){
        if (status == null){
            return null;
        }
        return status.getValor();
    }

    @Override
    public StatusUsuario convertToEntityAttribute(Integer data){
        if (data == null){
            return null;
        }
        return StatusUsuario.fromValor(data);
    }
}

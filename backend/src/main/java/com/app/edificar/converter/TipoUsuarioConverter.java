package com.app.edificar.converter;

import com.app.edificar.enums.TipoUsuario;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoUsuarioConverter implements AttributeConverter<TipoUsuario,Integer> {
    @Override
    public Integer convertToDatabaseColumn(TipoUsuario tipo){
        if (tipo == null){
            return null;
        }
        return tipo.getValor();
    }

    @Override
    public TipoUsuario convertToEntityAttribute(Integer data){
        if (data == null){
            return null;
        }
        return TipoUsuario.fromValor(data);
    }
}

package com.app.edificar.converter;

import com.app.edificar.enums.DiaPadrao;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class DiaConverter implements AttributeConverter<DiaPadrao,Integer> {

    @Override
    public Integer convertToDatabaseColumn(DiaPadrao dia){
        if (dia == null){
            return null;
        }
        return dia.getValor();
    }

    @Override
    public DiaPadrao convertToEntityAttribute(Integer data){
        if (data == null){
            return null;
        }
        return DiaPadrao.fromValor(data);
    }
}

package com.app.edificar.converter;

import com.app.edificar.enums.StatusPadrao;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatusPadraoConverter implements AttributeConverter<StatusPadrao,Integer> {
    @Override
    public Integer convertToDatabaseColumn(StatusPadrao status){
        if (status == null){
            return null;
        }
        return status.getValor();
    }

    @Override
    public StatusPadrao convertToEntityAttribute(Integer data){
        if (data == null){
            return null;
        }
        return StatusPadrao.fromValor(data);
    }
}

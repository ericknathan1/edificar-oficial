package com.app.edificar.converter;

import com.app.edificar.enums.StatusAula;
import com.app.edificar.enums.StatusPadrao;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatusAulaConverter implements AttributeConverter<StatusAula, Integer> {
    @Override
    public Integer convertToDatabaseColumn(StatusAula status){
        if (status == null){
            return null;
        }
        return status.getValor();
    }

    @Override
    public StatusAula convertToEntityAttribute(Integer data){
        if (data == null){
            return null;
        }
        return StatusAula.fromValor(data);
    }
}

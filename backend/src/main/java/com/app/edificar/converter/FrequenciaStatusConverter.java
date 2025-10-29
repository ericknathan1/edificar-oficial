package com.app.edificar.converter;

import com.app.edificar.enums.FrequenciaStatus;
import com.app.edificar.enums.StatusAula;
import com.app.edificar.enums.StatusPadrao;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class FrequenciaStatusConverter implements AttributeConverter<FrequenciaStatus, Integer> {
    @Override
    public Integer convertToDatabaseColumn(FrequenciaStatus status){
        if (status == null){
            return null;
        }
        return status.getValor();
    }

    @Override
    public FrequenciaStatus convertToEntityAttribute(Integer data){
        if (data == null){
            return null;
        }
        return FrequenciaStatus.fromValor(data);
    }
}

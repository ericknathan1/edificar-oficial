package com.app.edificar.enums;

public enum FrequenciaStatus {
    PENDENTE(2,"PENDENTE"),
    PRESENTE(1,"PRESENTE"),
    AUSENTE(0,"AUSENTE");

    private final int valor;
    private final String descricao;

    FrequenciaStatus(int valor, String descricao) {
        this.valor = valor;
        this.descricao = descricao;
    }

    public int getValor() {
        return valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public static FrequenciaStatus fromValor(Integer valor){
        if (valor == null){
            return null;
        }

        for (FrequenciaStatus status : values()){
            if (status.getValor() == valor){
                return status;
            }
        }

        throw new IllegalArgumentException("Valor de status inválido: "+valor);
    }
}

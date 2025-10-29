package com.app.edificar.enums;

public enum StatusAula {
    AGENDADA(1,"AGENDADA"),
    EM_ANDAMENTO(2,"EM_ANDAMENTO"),
    FINALIZADA(3,"FINALIZADA"),
    CANCELADA(0,"CANCELADA");

    private final int valor;
    private final String descricao;

    StatusAula(int valor, String descricao) {
        this.valor = valor;
        this.descricao = descricao;
    }

    public int getValor() {
        return valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public static StatusAula fromValor(Integer valor){
        if(valor==null){
            return null;
        }
        for(StatusAula status:values()){
            if (status.getValor() == valor){
                return status;
            }
        }
        throw new IllegalArgumentException("Valor de status inválido: "+valor);
    }

}

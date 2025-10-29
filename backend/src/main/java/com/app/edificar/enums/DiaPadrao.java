package com.app.edificar.enums;

public enum DiaPadrao {
    DOMINGO(1,"DOMINGO"),
    SEGUNDA(2,"SEGUNDA"),
    TERCA(3,"TERCA"),
    QUARTA(4,"QUARTA"),
    QUINTA(5,"QUINTA"),
    SEXTA(6,"SEXTA"),
    SABADO(7,"SABADO");

    private final int valor;
    private final String descricao;
    DiaPadrao(int valor,String descricao) {
        this.valor = valor;
        this.descricao = descricao;
    }

    public int getValor() {
        return valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public static DiaPadrao fromValor(Integer valor){
        if(valor==null){
            return null;
        }
        for(DiaPadrao dia:values()){
            if (dia.getValor() == valor){
                return dia;
            }
        }
        throw new IllegalArgumentException("Valor de tipo inválido: "+valor);
    }
}

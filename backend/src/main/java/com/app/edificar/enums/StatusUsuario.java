package com.app.edificar.enums;

public enum StatusUsuario {
    APAGADO(-1,"APAGADO"),
    ATIVO(1,"ATIVO"),
    INATIVO(2,"INATIVO");

    private final int valor;
    private final String descricao;

    StatusUsuario(int valor, String descricao) {
        this.valor = valor;
        this.descricao = descricao;
    }

    public int getValor() {
        return valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public static StatusUsuario fromValor(Integer valor){
        if (valor == null){
            return null;
        }

        for (StatusUsuario status : values()){
            if (status.getValor() == valor){
                return status;
            }
        }

        throw new IllegalArgumentException("Valor de status inválido: "+valor);
    }
}

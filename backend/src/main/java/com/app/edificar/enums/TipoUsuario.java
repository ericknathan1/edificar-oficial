package com.app.edificar.enums;

public enum TipoUsuario {
    ADMINISTRADOR(1,"ADMINISTRADOR"),
    PROFESSOR(2,"PROFESSOR");
    private final int valor;
    private final String descricao;
    TipoUsuario(int valor, String descricao) {
        this.valor = valor;
        this.descricao = descricao;
    }

    public int getValor() {
        return valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public static TipoUsuario fromValor(Integer valor){
        if(valor==null){
            return null;
        }
        for(TipoUsuario tipo:values()){
            if (tipo.getValor() == valor){
                return tipo;
            }
        }
        throw new IllegalArgumentException("Valor de tipo inválido: "+valor);
    }
}

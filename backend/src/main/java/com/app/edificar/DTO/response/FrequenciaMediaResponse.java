package com.app.edificar.DTO.response;

public class FrequenciaMediaResponse {
    private Long aulaId;
    private long totalAlunos;
    private long totalPresentes;
    private double mediaPercentual;

    // Construtores
    public FrequenciaMediaResponse() {}

    public FrequenciaMediaResponse(Long aulaId, long totalAlunos, long totalPresentes) {
        this.aulaId = aulaId;
        this.totalAlunos = totalAlunos;
        this.totalPresentes = totalPresentes;
        
        if (totalAlunos > 0) {
            this.mediaPercentual = ((double) totalPresentes / totalAlunos) * 100.0;
        } else {
            this.mediaPercentual = 0.0;
        }
    }

    // Getters e Setters
    public Long getAulaId() {
        return aulaId;
    }

    public void setAulaId(Long aulaId) {
        this.aulaId = aulaId;
    }

    public long getTotalAlunos() {
        return totalAlunos;
    }

    public void setTotalAlunos(long totalAlunos) {
        this.totalAlunos = totalAlunos;
    }

    public long getTotalPresentes() {
        return totalPresentes;
    }

    public void setTotalPresentes(long totalPresentes) {
        this.totalPresentes = totalPresentes;
    }

    public double getMediaPercentual() {
        return mediaPercentual;
    }

    public void setMediaPercentual(double mediaPercentual) {
        this.mediaPercentual = mediaPercentual;
    }
}

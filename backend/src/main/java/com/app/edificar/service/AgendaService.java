package com.app.edificar.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.app.edificar.entity.Aluno;
import com.app.edificar.entity.Aula;
import com.app.edificar.entity.Frequencia;
import com.app.edificar.entity.Turma;
import com.app.edificar.enums.DiaPadrao;
import com.app.edificar.enums.FrequenciaStatus;
import com.app.edificar.enums.StatusAula;
import com.app.edificar.repository.AlunoRepository;
import com.app.edificar.repository.AulaRepository;
import com.app.edificar.repository.FrequenciaRepository;

import jakarta.transaction.Transactional;

/*
* Classe de Serviço do SpringBoot para criar aulas automaticamente.
* */
@Service
public class AgendaService {

    /*
    Repositório das Aulas.
     */
    private AulaRepository aulaRepository;
    private AlunoRepository alunoRepository;
    private FrequenciaRepository frequenciaRepository;

    public AgendaService(AulaRepository aulaRepository, AlunoRepository alunoRepository, FrequenciaRepository frequenciaRepository) {
        this.aulaRepository = aulaRepository;
        this.alunoRepository = alunoRepository;
        this.frequenciaRepository = frequenciaRepository;
    }

    /*
            Retorna o ano atual.
             */
    public int retornarAnoAtual(){
        LocalDate dataAtual = LocalDate.now();
        return dataAtual.getYear();
    }

    public void AgendarFrequenciaPorInscricao(Long idTurma, Long idAluno){
        Aluno aluno = alunoRepository.alunoPorId(idAluno);
        List<Aula> aulasDaTurma = aulaRepository.aulasFuturasPorTurmaId(idTurma,LocalDate.now().minusDays(1));
        List<Frequencia> frequenciaList = new ArrayList<>();
        if (aulasDaTurma != null){
            if (aluno != null){
                for(Aula aula : aulasDaTurma){
                    Frequencia novaFrequencia = new Frequencia();
                    novaFrequencia.setAluno(aluno);
                    novaFrequencia.setStatus(FrequenciaStatus.PENDENTE);
                    novaFrequencia.setAula(aula);
                    frequenciaList.add(novaFrequencia);
                }
                frequenciaRepository.saveAll(frequenciaList);
            }else{
                throw new IllegalArgumentException("Aluno buscado não existe");
            }
        }else {
            System.out.println("Não há aulas a ser agendadas");
        }
    }

    private DayOfWeek converterDiaPadraoParaDayOfWeek(DiaPadrao diaPadrao) {
        switch (diaPadrao) {
            case SEGUNDA:
                return DayOfWeek.MONDAY;
            case TERCA:
                return DayOfWeek.TUESDAY;
            case QUARTA:
                return DayOfWeek.WEDNESDAY;
            case QUINTA:
                return DayOfWeek.THURSDAY;
            case SEXTA:
                return DayOfWeek.FRIDAY;
            case SABADO:
                return DayOfWeek.SATURDAY;
            case DOMINGO:
                return DayOfWeek.SUNDAY;
            default:
                // Lança uma exceção se o valor do enum for inesperado.
                throw new IllegalArgumentException("Dia da semana inválido: " + diaPadrao);
        }
    }
    /*
     * Gera aulas para uma turma anualmente.
     * */
    /*
     * Gera aulas para uma turma anualmente de forma otimizada e assíncrona.
     * Este método será executado em uma thread separada, não bloqueando a chamada principal.
     * */
    @Async
    public void AgendarAulaCriacao(Turma turma) {
        int ano = retornarAnoAtual();
        DayOfWeek diaDaSemanaDesejado = converterDiaPadraoParaDayOfWeek(turma.getDiaPadrao());

        LocalDate proximaData = LocalDate.now()
                .with(TemporalAdjusters.nextOrSame(diaDaSemanaDesejado));

        // Define a capacidade inicial da lista dinamicamente com base no ano ser bissexto ou não.
        // Um ano pode ter 52 ou 53 ocorrências de um determinado dia da semana.
        int capacidadeInicial = Year.of(ano).isLeap() ? 53 : 52;
        List<Aula> aulasParaSalvar = new ArrayList<>(capacidadeInicial);

        while (proximaData.getYear() == ano) {
            Aula novaAula = new Aula();
            novaAula.setTurma(turma);
            novaAula.setData(proximaData);
            novaAula.setStatus(StatusAula.AGENDADA); // Status "Agendada"

            aulasParaSalvar.add(novaAula);

            proximaData = proximaData.plusWeeks(1);
        }

        // Salva todas as aulas geradas em uma única operação de banco de dados
        aulaRepository.saveAll(aulasParaSalvar);
    }

    @Scheduled(cron = "0 0 0 * * *") // Cron: Seg Min Hora Dia Mês DiaSemana
    @Transactional // Garante que todas as alterações sejam salvas juntas
    public void cancelarAulasNaoRealizadas() {
        LocalDate hoje = LocalDate.now();
        
        // Busca aulas que ainda estão 'AGENDADA' mas a data é anterior a hoje
        List<Aula> aulasAtrasadas = aulaRepository.findByStatusAndDataBefore(StatusAula.AGENDADA, hoje);

        if (!aulasAtrasadas.isEmpty()) {
            System.out.println("Rotina de Cancelamento: Encontradas " + aulasAtrasadas.size() + " aulas expiradas.");
            
            for (Aula aula : aulasAtrasadas) {
                aula.setStatus(StatusAula.CANCELADA);
                // Opcional: Adicionar um log ou observação se desejar
                // aula.setTopico("Cancelada automaticamente pelo sistema por falta de execução.");
            }
            
            aulaRepository.saveAll(aulasAtrasadas);
            System.out.println("Rotina de Cancelamento: Aulas atualizadas com sucesso.");
        }
    }
}

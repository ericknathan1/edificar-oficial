import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AlertDialog } from '@/src/shared/components/ui/alertDialog';
import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { Header } from '@/src/shared/components/ui/header';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';

import { AulaResponse } from '@/src/core/types/aulas';
import { StatusAula } from '@/src/shared/enums/statusAula';
import { usePermissions } from '@/src/shared/hooks/usePermissions';
import { formatTitleCase } from '@/src/shared/resources/formatters/fortmatTitleCase';
import AulaService from '@/src/shared/services/aula';

interface Props {
  aulaId: number;
  onBack: () => void;
  onEdit: (id: number) => void;
  onChamada: (id: number) => void; 
}

const AulaDetalheScreen = ({ aulaId, onBack, onEdit, onChamada }: Props) => {
  const { isAdmin, isProfessor} = usePermissions();
  const [aula, setAula] = useState<AulaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  const fetchAula = async () => {
    setLoading(true);
    try {
      const data = await AulaService.retornarAulaPorId(aulaId);
      setAula(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a aula.');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAula();
  }, [aulaId]);

  const handleIniciar = async () => {
    setProcessing(true);
    try {
        await AulaService.iniciarAula(aulaId);
        // Não usamos Alert aqui para ser mais fluido, apenas recarregamos
        fetchAula(); 
    } catch (error) {
        Alert.alert("Erro", "Não foi possível iniciar a aula. Verifique se você é o professor responsável.");
    } finally {
        setProcessing(false);
    }
  };

  const handleFinalizar = async () => {
    setShowFinishDialog(false);
    setProcessing(true);
    try {
        await AulaService.finalizarAula(aulaId);
        Alert.alert("Sucesso", "Aula finalizada com sucesso!");
        fetchAula();
    } catch (error) {
        Alert.alert("Erro", "Não foi possível finalizar a aula.");
    } finally {
        setProcessing(false);
    }
  };

  const handleCancelar = async () => {
    setShowCancelDialog(false);
    setProcessing(true);
    try {
        await AulaService.cancelarAula(aulaId);
        Alert.alert("Sucesso", "Aula cancelada.");
        onBack(); 
    } catch (error) {
        Alert.alert("Erro", "Erro ao cancelar. Verifique se a aula já não foi iniciada.");
    } finally {
        setProcessing(false);
    }
  };

  if (loading || !aula) {
    return (
      <ScreenContainer style={styles.center}>
        <Spinner size="large" />
      </ScreenContainer>
    );
  }

  const isAgendada = aula.statusAula === StatusAula.AGENDADA;
  const isEmAndamento = aula.statusAula === StatusAula.EM_ANDAMENTO;
  const isFinalizada = aula.statusAula === StatusAula.FINALIZADA;
  
  // Formatação de data/hora segura
  const dataFormatada = aula.data ? new Date(aula.data).toLocaleDateString('pt-BR') : '--/--/----';

  return (
    <ScreenContainer>
      <Header title="Detalhes da Aula" onBack={onBack} />
      <ScrollView style={styles.container}>
        
        <Card style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.topic}>{aula.topico || "Sem Tópico Definido"}</Text>
                <View style={[styles.statusBadge, 
                    isAgendada ? styles.bgWarning : isEmAndamento ? styles.bgSuccess : styles.bgGray
                ]}>
                    <Text style={styles.statusText}>{formatTitleCase(aula.statusAula)}</Text>
                </View>
            </View>

            <Text style={styles.detailLabel}>Data:</Text>
            <Text style={styles.detailValue}>{dataFormatada}</Text>
            
            <Text style={styles.detailLabel}>Professor:</Text>
            <Text style={styles.detailValue}>{aula.usuario?.nome || "Não atribuído"}</Text>
            
            <Text style={styles.detailLabel}>Horário:</Text>
            <Text style={styles.detailValue}>{aula.horaInicio || '--:--'} às {aula.horafim || '--:--'}</Text>
        </Card>

        <View style={styles.actionGroup}>
            {/* Ações para Aula AGENDADA */}
            {isAgendada && (
                <>
                    {(isAdmin || isProfessor) && (
                        <Button 
                            title="Iniciar Aula" 
                            onPress={handleIniciar} 
                            variant="success" 
                            loading={processing}
                            style={styles.button}
                        />
                    )}
                    
                    {isAdmin && (
                      <>
                        <Button 
                            title="Editar Dados" 
                            onPress={() => onEdit(aulaId)} 
                            variant="warning" 
                            disabled={processing}
                            style={styles.button}
                        />
                        <Button 
                            title="Cancelar Aula" 
                            onPress={() => setShowCancelDialog(true)} 
                            variant="danger" 
                            disabled={processing}
                            style={styles.button}
                        />
                      </>
                    )}
                </>
            )}

            {/* Ações para Aula EM ANDAMENTO */}
            {isEmAndamento && (
                <>
                     <Button 
                        title="Realizar Chamada" 
                        onPress={() => onChamada(aulaId)} 
                        variant="primary" 
                        style={styles.button}
                    />
                    
                    {(isAdmin || isProfessor) && (
                        <Button 
                            title="Finalizar Aula" 
                            onPress={() => setShowFinishDialog(true)} 
                            variant="danger" 
                            loading={processing}
                            style={styles.button}
                        />
                    )}
                </>
            )}

            {/* Ações para Aula FINALIZADA */}
            {isFinalizada && (
                 <Button 
                 title="Ver Histórico de Frequência" 
                 onPress={() => onChamada(aulaId)} 
                 variant="ghost" 
                 style={styles.button}
             />
            )}
        </View>

      </ScrollView>

      {/* Dialog de Cancelamento */}
      <AlertDialog 
        visible={showCancelDialog}
        title="Cancelar Aula"
        message="Tem certeza? Isso removerá a aula do calendário dos alunos."
        onConfirm={handleCancelar}
        onCancel={() => setShowCancelDialog(false)}
        confirmText="Sim, Cancelar"
      />

       {/* Dialog de Finalização */}
       <AlertDialog 
        visible={showFinishDialog}
        title="Finalizar Aula"
        message="Deseja encerrar a aula? Certifique-se de ter realizado a chamada."
        onConfirm={handleFinalizar}
        onCancel={() => setShowFinishDialog(false)}
        confirmText="Finalizar"
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { padding: 20, marginBottom: 20, borderRadius: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  topic: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  bgSuccess: { backgroundColor: '#28a745' },
  bgWarning: { backgroundColor: '#ffc107' },
  bgGray: { backgroundColor: '#6c757d' },
  
  detailLabel: { fontSize: 14, color: '#888', marginTop: 8 },
  detailValue: { fontSize: 16, color: '#333', fontWeight: '500' },
  
  actionGroup: { gap: 12 },
  button: { width: '100%' }
});

export default AulaDetalheScreen;
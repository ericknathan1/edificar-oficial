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
import { formatTitleCase } from '@/src/shared/resources/formatters/fortmatTitleCase';
import AulaService from '@/src/shared/services/aula';

interface Props {
  aulaId: number;
  onBack: () => void;
  onEdit: (id: number) => void;
  onChamada: (id: number) => void; // Callback para abrir a tela de chamada
}

const AulaDetalheScreen = ({ aulaId, onBack, onEdit, onChamada }: Props) => {
  const [aula, setAula] = useState<AulaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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
        Alert.alert("Sucesso", "Aula iniciada!");
        fetchAula(); // Recarrega para atualizar status
    } catch (error) {
        Alert.alert("Erro", "Não foi possível iniciar a aula.");
    } finally {
        setProcessing(false);
    }
  };

  const handleFinalizar = async () => {
    setProcessing(true);
    try {
        await AulaService.finalizarAula(aulaId);
        Alert.alert("Sucesso", "Aula finalizada!");
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
        onBack(); // Volta para a lista pois a aula "sumiu" ou mudou de status drasticamente
    } catch (error) {
        Alert.alert("Erro", "Não foi possível cancelar a aula.");
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

  return (
    <ScreenContainer>
      <Header title="Detalhes da Aula" onBack={onBack} />
      <ScrollView style={styles.container}>
        
        <Card style={styles.card}>
            <Text style={styles.topic}>{aula.topico || "Sem Tópico"}</Text>
            <Text style={styles.detail}>Data: {new Date(aula.data).toLocaleDateString('pt-BR')}</Text>
            <Text style={styles.detail}>Professor: {aula.usuario?.nome || "Não atribuído"}</Text>
            <Text style={styles.detail}>Horário: {aula.horaInicio || '--'} às {aula.horafim || '--'}</Text>
            <Text style={[styles.detail, { fontWeight: 'bold', color: '#003F72' }]}>
                Status: {formatTitleCase(aula.statusAula)}
            </Text>
        </Card>

        <View style={styles.actionGroup}>
            {isAgendada && (
                <>
                    <Button 
                        title="Iniciar Aula" 
                        onPress={handleIniciar} 
                        variant="success" 
                        loading={processing}
                        style={styles.button}
                    />
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

            {isEmAndamento && (
                <>
                     <Button 
                        title="Realizar Chamada / Frequência" 
                        onPress={() => onChamada(aulaId)} 
                        variant="primary" 
                        style={styles.button}
                        // Ícone seria ideal aqui
                    />
                    <Button 
                        title="Finalizar Aula" 
                        onPress={handleFinalizar} 
                        variant="danger" 
                        loading={processing}
                        style={styles.button}
                    />
                </>
            )}

            {!isAgendada && !isEmAndamento && (
                 <Button 
                 title="Ver Frequência" 
                 onPress={() => onChamada(aulaId)} // Reutiliza tela de chamada para visualização
                 variant="ghost" 
                 style={styles.button}
             />
            )}
        </View>

      </ScrollView>

      <AlertDialog 
        visible={showCancelDialog}
        title="Cancelar Aula"
        message="Tem certeza que deseja cancelar esta aula? Esta ação não pode ser desfeita."
        onConfirm={handleCancelar}
        onCancel={() => setShowCancelDialog(false)}
        confirmText="Sim, Cancelar"
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { padding: 20, marginBottom: 20 },
  topic: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  detail: { fontSize: 16, color: '#555', marginBottom: 5 },
  actionGroup: { gap: 10 },
  button: { marginBottom: 10 }
});

export default AulaDetalheScreen;
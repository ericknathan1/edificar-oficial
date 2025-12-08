import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Header } from '@/src/shared/components/ui/header';
import { Card } from '@/src/shared/components/ui/card';
import { Button } from '@/src/shared/components/ui/button';
import { Spinner } from '@/src/shared/components/ui/spinner';

import { FrequenciaResponse } from '@/src/core/types/frequencias';
import { FrequenciaStatus } from '@/src/shared/enums/frequenciaStatus';
import FrequenciaService from '@/src/shared/services/frequencia';
import { useAuth } from '@/src/shared/hooks/useAuth'; // Assumindo que você tem esse hook para pegar o ID do professor logado

interface Props {
  aulaId: number;
  onBack: () => void;
}

const ChamadaScreen = ({ aulaId, onBack }: Props) => {
  const { user } = useAuth(); // Necessário para enviar o professorId no request
  const [frequencias, setFrequencias] = useState<FrequenciaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null); // Para mostrar loading no botão específico

  // Busca a lista de alunos/frequencias vinculados a esta aula
  const fetchFrequencias = async () => {
    try {
      setLoading(true);
      const data = await FrequenciaService.retornarFrequenciasPorAula(aulaId);
      // Ordena alfabeticamente por nome de aluno para facilitar a chamada
      const sorted = data.sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome));
      setFrequencias(sorted);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a lista de presença.');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrequencias();
  }, [aulaId]);

  // Função para aplicar presença/falta
  const handleAplicarFrequencia = async (frequencia: FrequenciaResponse, novoStatus: FrequenciaStatus) => {
    if (!user?.id) {
        Alert.alert("Erro", "Usuário não identificado.");
        return;
    }

    setUpdatingId(frequencia.aluno.id); // Bloqueia apenas o item que está sendo editado

    try {
      const response = await FrequenciaService.aplicarPresenca(aulaId, {
        alunoId: frequencia.aluno.id,
        professorId: user.id,
        status: novoStatus,
        justificativa: frequencia.justificativa || "" // Mantém justificativa se houver
      });

      // Atualiza a lista localmente para refletir a mudança sem recarregar tudo
      setFrequencias(prev => prev.map(item => 
        item.aluno.id === frequencia.aluno.id ? { ...item, status: response.status } : item
      ));

    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar presença.');
    } finally {
      setUpdatingId(null);
    }
  };

  const renderItem = ({ item }: { item: FrequenciaResponse }) => {
    const isPresente = item.status === FrequenciaStatus.PRESENTE;
    const isAusente = item.status === FrequenciaStatus.AUSENTE;
    const isLoadingThis = updatingId === item.aluno.id;

    return (
      <Card style={styles.cardItem}>
        <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.aluno.nome}</Text>
            <Text style={styles.studentMatricula}>Mat: {item.aluno.matricula}</Text>
        </View>
        
        <View style={styles.actionButtons}>
            {/* Botão Presente */}
            <Button
                title="P"
                variant={isPresente ? "success" : "outline"} // Fica verde se já estiver presente
                onPress={() => handleAplicarFrequencia(item, FrequenciaStatus.PRESENTE)}
                disabled={isLoadingThis}
                style={[styles.smallButton, { marginRight: 8 }]}
            />
            
            {/* Botão Ausente */}
            <Button
                title="F"
                variant={isAusente ? "danger" : "outline"} // Fica vermelho se já estiver ausente
                onPress={() => handleAplicarFrequencia(item, FrequenciaStatus.AUSENTE)}
                disabled={isLoadingThis}
                style={styles.smallButton}
            />
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <ScreenContainer style={styles.center}>
        <Spinner size="large" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title="Lista de Chamada" onBack={onBack} />
      
      <View style={styles.infoHeader}>
        <Text style={styles.summaryText}>Total de Alunos: {frequencias.length}</Text>
        <Text style={styles.summaryText}>
            Presentes: {frequencias.filter(f => f.status === FrequenciaStatus.PRESENTE).length}
        </Text>
      </View>

      <FlatList
        data={frequencias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum aluno encontrado nesta turma.</Text>}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8, marginHorizontal: 20, marginBottom: 10 },
  summaryText: { fontWeight: 'bold', color: '#555' },
  listContent: { padding: 20 },
  cardItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, marginBottom: 12 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  studentMatricula: { fontSize: 12, color: '#777' },
  actionButtons: { flexDirection: 'row' },
  smallButton: { width: 50, height: 40, justifyContent: 'center', paddingHorizontal: 0 }, // Botões menores
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 }
});

export default ChamadaScreen;
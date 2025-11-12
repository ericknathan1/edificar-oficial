import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { Header } from '@/src/shared/components/ui/header';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';
import { useProfessorDetalhes } from '@/src/shared/hooks/useProfessores';
import { formatTitleCase } from '@/src/shared/resources/formatters/fortmatTitleCase';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

interface Props {
  professorId: number;
  onBack: () => void;
}

const ProfessorDetalheScreen = ({ professorId, onBack }: Props) => {
  const { professor, turmas, isLoading, error, refetch } = useProfessorDetalhes(professorId);

  if (isLoading) {
    return (
        <ScreenContainer style={styles.center}>
            <Spinner size="large" />
            <Text>Carregando detalhes do professor...</Text>
        </ScreenContainer>
    );
  }

  if (error || !professor) {
    return (
        <ScreenContainer style={styles.center}>
            <Text style={styles.errorText}>{error || 'Professor não encontrado.'}</Text>
            <Button title="Voltar" onPress={onBack} variant="ghost" />
            <Button title="Tentar Novamente" onPress={refetch} />
        </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title={professor.nome} onBack={onBack} />
      
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
            <Text style={styles.detail}>ID: {professor.id}</Text>
            <Text style={styles.detail}>Email: {professor.email}</Text>
            <Text style={styles.detail}>Status: {professor.status}</Text>
        </Card>

        <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Turmas Lecionadas ({turmas.length})</Text>
            {turmas.length > 0 ? (
                turmas.map(turma => (
                    <Text key={turma.id} style={styles.listItem}>
                        • {turma.nome} ({formatTitleCase(turma.diaPadrao)})
                    </Text>
                ))
            ) : (
                <Text style={styles.listItem}>Nenhuma turma associada.</Text>
            )}
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    card: { 
        padding: 20, 
        marginBottom: 20,
    },
    detail: { 
        fontSize: 16, 
        color: '#333', 
        marginBottom: 8 
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listItem: {
        fontSize: 15,
        color: '#666',
        paddingVertical: 3,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center'
    },
});

export default ProfessorDetalheScreen;
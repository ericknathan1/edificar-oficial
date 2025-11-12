import { AlertDialog } from '@/src/shared/components/ui/alertDialog';
import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { Header } from '@/src/shared/components/ui/header';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';
import { useAlunoDetalhes } from '@/src/shared/hooks/useAlunos';
import AlunoService from '@/src/shared/services/aluno';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Props {
  alunoId: number;
  onBack: () => void;
  onEdit: (id: number) => void;
  onDeleteSuccess: () => void;
}

const AlunoDetalheScreen = ({ alunoId, onBack, onEdit, onDeleteSuccess }: Props) => {
  const { aluno, turmas, frequencias, isLoading, error, refetch } = useAlunoDetalhes(alunoId);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

  const handleDelete = () => {
    setIsDeleteAlertVisible(true);
  };

  const confirmDelete = async () => {
    if (!aluno) return;
    setIsDeleteAlertVisible(false);
    setIsDeleting(true);
    try {
      await AlunoService.deletarAluno(aluno.id);
      Alert.alert('Sucesso', 'Aluno apagado.');
      onDeleteSuccess();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível apagar o aluno.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
        <ScreenContainer style={styles.center}>
            <Spinner size="large" />
            <Text>Carregando detalhes do aluno...</Text>
        </ScreenContainer>
    );
  }

  if (error || !aluno) {
    return (
        <ScreenContainer style={styles.center}>
            <Text style={styles.errorText}>{error || 'Aluno não encontrado.'}</Text>
            <Button title="Voltar" onPress={onBack} variant="ghost" />
            <Button title="Tentar Novamente" onPress={refetch} />
        </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title={aluno.nomeCompleto} onBack={onBack} />
      
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
            <Text style={styles.detail}>ID: {aluno.id}</Text>
            <Text style={styles.detail}>Nascimento: {new Date(aluno.dataNasc).toLocaleDateString()}</Text>
            <Text style={styles.detail}>Responsável: {aluno.contatoResponsavel}</Text>
            <Text style={styles.detail}>Status: {aluno.status}</Text>
        </Card>

        <View style={styles.actionButtons}>
            <Button 
                title="Editar" 
                onPress={() => onEdit(aluno.id)} 
                variant="warning"
                style={styles.actionButton}
                disabled={isDeleting}
            />
            <Button 
                title="Apagar"
                onPress={handleDelete}
                variant="danger"
                style={styles.actionButton}
                loading={isDeleting}
                disabled={isDeleting}
            />
        </View>

        <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Turmas ({turmas.length})</Text>
            {turmas.length > 0 ? (
                turmas.map(turma => <Text key={turma.id} style={styles.listItem}>• {turma.nome}</Text>)
            ) : (
                <Text style={styles.listItem}>Nenhuma turma associada.</Text>
            )}
        </Card>

        <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Frequências ({frequencias.length})</Text>
            {frequencias.length > 0 ? (
                frequencias.map(freq => (
                    <Text key={freq.id} style={styles.listItem}>
                        • {new Date(freq.aula.data).toLocaleDateString()}: {freq.status}
                    </Text>
                ))
            ) : (
                <Text style={styles.listItem}>Nenhum registro de frequência.</Text>
            )}
        </Card>
      </ScrollView>

      <AlertDialog
        visible={isDeleteAlertVisible}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja apagar o aluno "${aluno?.nomeCompleto}"?`}
        confirmText="Apagar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteAlertVisible(false)}
      />
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
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

export default AlunoDetalheScreen;
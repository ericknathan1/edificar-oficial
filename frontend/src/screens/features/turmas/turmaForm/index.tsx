import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/src/shared/components/ui/button';
import { Header } from '@/src/shared/components/ui/header';
import { Input } from '@/src/shared/components/ui/input';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';

import { TurmaRequest } from '@/src/core/types/turma';
import { DiaPadrao } from '@/src/shared/enums/diaPadrao';
import TurmaService from '@/src/shared/services/turma';

interface Props {
  turmaId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const TurmaFormScreen = ({ turmaId, onSuccess, onCancel }: Props) => {
  const [nome, setNome] = useState('');
  const [faixaEtaria, setFaixaEtaria] = useState('');
  const [diaPadrao, setDiaPadrao] = useState<DiaPadrao>(DiaPadrao.DOMINGO);
  
  // Novo estado para controlar o agendamento
  const [gerarAgendamento, setGerarAgendamento] = useState(true);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEditing = !!turmaId;

  // Lista de dias para o Picker
  const diasSemana = [
    { label: 'Domingo', value: DiaPadrao.DOMINGO },
    { label: 'Segunda-feira', value: DiaPadrao.SEGUNDA },
    { label: 'Terça-feira', value: DiaPadrao.TERCA },
    { label: 'Quarta-feira', value: DiaPadrao.QUARTA },
    { label: 'Quinta-feira', value: DiaPadrao.QUINTA },
    { label: 'Sexta-feira', value: DiaPadrao.SEXTA },
    { label: 'Sábado', value: DiaPadrao.SABADO },
  ];

  useEffect(() => {
    if (isEditing && turmaId) {
      const loadData = async () => {
        setLoading(true);
        try {
          const turma = await TurmaService.returnTurmaById(turmaId);
          if (turma) {
            setNome(turma.nome);
            setFaixaEtaria(turma.faixaEtaria);
            setDiaPadrao(turma.diaPadrao);
          }
        } catch (error) {
          Alert.alert('Erro', 'Falha ao carregar dados da turma.');
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [turmaId]);

  const handleSubmit = async () => {
    if (!nome || !faixaEtaria) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    const request: TurmaRequest = {
      nome,
      faixaEtaria,
      diaPadrao
    };

    try {
      if (isEditing && turmaId) {
        await TurmaService.updateTurma(turmaId, request);
        Alert.alert('Sucesso', 'Turma atualizada!');
      } else {
        // Lógica de decisão: Com ou Sem aulas
        if (gerarAgendamento) {
            await TurmaService.createTurma(request); // Endpoint padrão
            Alert.alert('Sucesso', 'Turma criada e aulas agendadas!');
        } else {
            await TurmaService.createTurmaSemAula(request); // Novo Endpoint
            Alert.alert('Sucesso', 'Turma criada (sem aulas agendadas)!');
        }
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a turma.');
    } finally {
      setSaving(false);
    }
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
      <Header title={isEditing ? "Editar Turma" : "Nova Turma"} onBack={onCancel} />
      <ScrollView style={styles.container}>
        
        <Input
          label="Nome da Turma:"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Jovens, Casais..."
        />

        <Input
          label="Faixa Etária:"
          value={faixaEtaria}
          onChangeText={setFaixaEtaria}
          placeholder="Ex: 18 a 25 anos"
        />

        <Text style={styles.label}>Dia Padrão das Aulas:</Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={diaPadrao}
                onValueChange={(itemValue) => setDiaPadrao(itemValue)}
                style={styles.picker}
            >
                {diasSemana.map(dia => (
                    <Picker.Item key={dia.value} label={dia.label} value={dia.value} />
                ))}
            </Picker>
        </View>

        {/* Exibe opção de agendamento apenas se for Nova Turma */}
        {!isEditing && (
            <View style={styles.switchContainer}>
                <View style={styles.switchTextContainer}>
                    <Text style={styles.switchTitle}>Gerar Agenda Automática</Text>
                    <Text style={styles.switchSubtitle}>
                        Criar aulas automaticamente para o ano todo baseadas no dia padrão selecionado.
                    </Text>
                </View>
                <Switch 
                    value={gerarAgendamento} 
                    onValueChange={setGerarAgendamento}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={gerarAgendamento ? "#003F72" : "#f4f3f4"}
                />
            </View>
        )}

        <View style={styles.buttonGroup}>
             <Button 
                title="Cancelar" 
                onPress={onCancel} 
                disabled={saving} 
                variant="ghost" 
                style={styles.halfButton} 
             />
             <Button 
                title="Salvar" 
                onPress={handleSubmit} 
                loading={saving} 
                disabled={saving} 
                style={styles.halfButton} 
             />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 16, color: '#333', marginBottom: 8, fontWeight: '500' },
  pickerContainer: {
    borderWidth: 1, borderColor: '#D1D1D1', borderRadius: 8, marginBottom: 20, backgroundColor: '#F9F9F9'
  },
  picker: { height: 50 },
  // Estilos do Switch
  switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#E6F4FE',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#cee5f5'
  },
  switchTextContainer: {
      flex: 1,
      paddingRight: 10
  },
  switchTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#003F72'
  },
  switchSubtitle: {
      fontSize: 12,
      color: '#555',
      marginTop: 4
  },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  halfButton: { width: '48%' }
});

export default TurmaFormScreen;
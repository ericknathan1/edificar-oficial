import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/shared/components/ui/button';
import { Header } from '@/src/shared/components/ui/header';
import { Input } from '@/src/shared/components/ui/input';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';

import { AulaRequest, AulaUpdateRequest } from '@/src/core/types/aulas';
import { UsuarioDadosResponse } from '@/src/core/types/usuario';
import { useAuth } from '@/src/shared/hooks/useAuth';
import AulaService from '@/src/shared/services/aula';
import ProfessorService from '@/src/shared/services/professor';

interface Props {
  turmaId: number;
  aulaId?: number; // Se presente, é edição
  onSuccess: () => void;
  onCancel: () => void;
}

const AulaFormScreen = ({ turmaId, aulaId, onSuccess, onCancel }: Props) => {
  const { user } = useAuth();
  const [data, setData] = useState(''); // YYYY-MM-DD
  const [topico, setTopico] = useState('');
  const [visitantes, setVisitantes] = useState('0');
  const [professorId, setProfessorId] = useState<number | null>(user ? user.id : null);
  
  const [professores, setProfessores] = useState<UsuarioDadosResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEditing = !!aulaId;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Carregar lista de professores para o Picker
        const profs = await ProfessorService.listarProfessores();
        if (profs) setProfessores(profs);

        // Se for edição, carregar dados da aula
        if (isEditing && aulaId) {
          const aula = await AulaService.retornarAulaPorId(aulaId);
          if (aula) {
            setData(new Date(aula.data).toISOString().split('T')[0]);
            setTopico(aula.topico || '');
            setVisitantes(aula.visitantes?.toString() || '0');
            if (aula.usuario) setProfessorId(aula.usuario.id);
          }
        } else {
            // Se for nova aula, data de hoje como padrão
            setData(new Date().toISOString().split('T')[0]);
        }
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar dados.');
        onCancel();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [aulaId]);

  const handleSubmit = async () => {
    if (!data) {
      Alert.alert('Erro', 'A data é obrigatória.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing && aulaId) {
        // Edição
        const request: AulaUpdateRequest = {
          data: new Date(data),
          topico: topico,
          visitante: parseInt(visitantes, 10),
          usuarioId: professorId || undefined
        };
        await AulaService.reagendarAula(aulaId, request);
        Alert.alert('Sucesso', 'Aula atualizada!');
      } else {
        // Criação
        const request: AulaRequest = {
          data: new Date(data),
          turmaId: turmaId,
          usuarioId: professorId || undefined
        };
        await AulaService.salvarAula(request);
        Alert.alert('Sucesso', 'Aula agendada!');
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a aula. Verifique os dados.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer style={styles.center}>
        <Spinner size="large" />
        <Text>Carregando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title={isEditing ? "Editar Aula" : "Nova Aula"} onBack={onCancel} />
      <ScrollView style={styles.container}>
        
        <Input
          label="Data (YYYY-MM-DD):"
          value={data}
          onChangeText={setData}
          placeholder="2024-12-31"
          keyboardType="numeric"
        />

        <Input
          label="Tópico / Tema da Aula:"
          value={topico}
          onChangeText={setTopico}
          placeholder="Ex: A Parábola do Semeador"
        />

        {isEditing && (
           <Input
            label="Número de Visitantes:"
            value={visitantes}
            onChangeText={setVisitantes}
            keyboardType="numeric"
           />
        )}

        <Text style={styles.label}>Professor Responsável:</Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={professorId}
                onValueChange={(itemValue) => setProfessorId(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Selecione um professor..." value={null} />
                {professores.map(prof => (
                    <Picker.Item key={prof.id} label={prof.nome} value={prof.id} />
                ))}
            </Picker>
        </View>

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
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  halfButton: { width: '48%' }
});

export default AulaFormScreen;
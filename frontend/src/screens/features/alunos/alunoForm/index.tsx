import { AlunoRequest, AlunoResponse } from '@/src/core/types/alunos';
import { Button } from '@/src/shared/components/ui/button';
import { Header } from '@/src/shared/components/ui/header';
import { Input } from '@/src/shared/components/ui/input';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';
import AlunoService from '@/src/shared/services/aluno';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
// Você pode querer adicionar um DatePicker, mas por simplicidade vamos usar Input
// import DatePicker from '@react-native-community/datetimepicker'; 

interface Props {
  alunoId?: number;
  onSuccess: (aluno: AlunoResponse) => void;
  onCancel: () => void;
}

const AlunoFormScreen = ({ alunoId, onSuccess, onCancel }: Props) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNasc, setDataNasc] = useState(''); // Armazenar como string YYYY-MM-DD
  const [contatoResponsavel, setContatoResponsavel] = useState('');

  const [loading, setLoading] = useState(false); // Para carregar dados
  const [saving, setSaving] = useState(false); // Para salvar/criar
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (alunoId) {
      setIsEditing(true);
      const loadAluno = async () => {
        setLoading(true);
        try {
          const data = await AlunoService.retornarAlunoPorId(alunoId);
          if (data) {
            setNomeCompleto(data.nomeCompleto);
            setContatoResponsavel(data.contatoResponsavel);
            // Formata a data para YYYY-MM-DD para o input
            setDataNasc(new Date(data.dataNasc).toISOString().split('T')[0]);
          } else {
            Alert.alert("Erro", "Não foi possível carregar os dados do aluno.");
            onCancel();
          }
        } catch (err) {
          Alert.alert("Erro", "Falha ao buscar dados do aluno.");
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      loadAluno();
    }
  }, [alunoId, onCancel]);

  const handleSubmit = async () => {
    if (!nomeCompleto || !dataNasc || !contatoResponsavel) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    const dataObj = new Date(dataNasc);
    if (isNaN(dataObj.getTime())) {
        Alert.alert("Erro", "Data de nascimento inválida. Use o formato YYYY-MM-DD.");
        return;
    }

    const request: AlunoRequest = {
      nomeCompleto,
      dataNasc: dataObj,
      contatoResponsavel,
    };

    setSaving(true);
    try {
      let response: AlunoResponse | undefined;

      if (isEditing && alunoId) {
        response = await AlunoService.atualizarAluno(alunoId, request);
        if (response) {
            Alert.alert("Sucesso", "Aluno atualizado com sucesso!");
        }
      } else {
        response = await AlunoService.criarAluno(request);
        if (response) {
            Alert.alert("Sucesso", "Aluno criado com sucesso!");
        }
      }

      if (response) {
        onSuccess(response);
      } else {
        Alert.alert("Erro", `Não foi possível ${isEditing ? 'atualizar' : 'criar'} o aluno.`);
      }

    } catch (err) {
      console.error("Erro ao submeter o formulário de aluno:", err);
      Alert.alert("Erro de API", `Falha ao ${isEditing ? 'atualizar' : 'criar'} o aluno.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer style={styles.center}>
        <Spinner size="large" />
        <Text>Carregando dados do aluno...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header
        title={isEditing ? 'Editar Aluno' : 'Novo Aluno'}
        onBack={onCancel}
      />
      <ScrollView style={styles.container}>
        <Input
          label="Nome Completo:"
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          placeholder="Nome completo do aluno"
          autoCapitalize="words"
          editable={!saving}
        />

        <Input
          label="Data de Nascimento (YYYY-MM-DD):"
          value={dataNasc}
          onChangeText={setDataNasc}
          placeholder="YYYY-MM-DD"
          keyboardType="numeric"
          editable={!saving}
        />

        <Input
          label="Contato do Responsável:"
          value={contatoResponsavel}
          onChangeText={setContatoResponsavel}
          placeholder="Telefone ou email"
          autoCapitalize="none"
          editable={!saving}
        />

        <View style={styles.buttonGroup}>
          <Button
            title="Cancelar"
            onPress={onCancel}
            disabled={saving}
            variant="ghost"
            style={styles.button}
          />
          <Button
            title={isEditing ? 'Salvar Alterações' : 'Criar Aluno'}
            onPress={handleSubmit}
            loading={saving}
            disabled={saving}
            style={styles.button}
            variant={isEditing ? 'warning' : 'success'}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlunoFormScreen;
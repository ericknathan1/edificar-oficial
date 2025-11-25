import { AlunoRequest, AlunoResponse } from '@/src/core/types/alunos';
import { Button } from '@/src/shared/components/ui/button';
import { Header } from '@/src/shared/components/ui/header';
import { Input } from '@/src/shared/components/ui/input';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';
import AlunoService from '@/src/shared/services/aluno';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Importação do DatePicker para uso.
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface Props {
  alunoId?: number;
  onSuccess: (aluno: AlunoResponse) => void;
  onCancel: () => void;
}

const AlunoFormScreen = ({ alunoId, onSuccess, onCancel }: Props) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNasc, setDataNasc] = useState<Date>(new Date()); // Mudança: Armazenar como objeto Date
  const [contatoResponsavel, setContatoResponsavel] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // Novo estado para controlar a visibilidade do picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Helper para formatar a data para exibição no Input (apenas leitura)
  const formattedDate = dataNasc.toLocaleDateString('pt-BR');

  // Lida com a seleção de data no picker
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Esconde o picker no iOS imediatamente após a seleção (ou cancelamento)
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
    
    // Se a ação for 'set' e houver data selecionada, atualiza o estado
    if (event.type === 'set' && selectedDate) {
      setDataNasc(selectedDate);
    }
    
    // Se for Android, esconde o picker e a lógica de atualização ocorre acima
    if (Platform.OS === 'android') {
        setShowDatePicker(false);
    }
  };

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
            // Define a dataNasc como objeto Date
            setDataNasc(new Date(data.dataNasc)); 
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
    if (!nomeCompleto || !contatoResponsavel) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    
    // A dataNasc já é um objeto Date, não precisa de validação de formato de string.

    const request: AlunoRequest = {
      nomeCompleto,
      dataNasc: dataNasc, // Usando o objeto Date
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

        {/* --- Substituição do Input de Data por um TouchableOpacity que abre o DatePicker --- */}
        <View style={styles.datePickerWrapper}>
            <Text style={styles.label}>Data de Nascimento:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} disabled={saving} style={styles.dateInput}>
                <Text style={styles.dateText}>{formattedDate}</Text>
            </TouchableOpacity>
        </View>

        {/* DatePicker para Android (sempre visível ao ser ativado) e iOS (em modal/popover) */}
        {showDatePicker && (
            <DateTimePicker
                value={dataNasc}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Usa spinner no iOS para melhor UX
                onChange={onChangeDate}
                maximumDate={new Date()} // Opcional: Impedir datas futuras
            />
        )}
        
        {/* --- Fim da Substituição --- */}


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
  datePickerWrapper: {
    marginBottom: 15,
  },
  dateInput: {
    height: 50,
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    width: '100%',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
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
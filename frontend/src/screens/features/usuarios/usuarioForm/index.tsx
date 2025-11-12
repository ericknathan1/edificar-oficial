import { UsuarioRequest } from '@/src/core/types/usuario';
import UserService from '@/src/shared/services/usuario';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';

// Importando hooks e componentes de UI
import { Button } from '@/src/shared/components/ui/button';
import { Header } from '@/src/shared/components/ui/header';
import { Input } from '@/src/shared/components/ui/input';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';

interface Props {
  usuarioId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const UsuarioFormScreen = ({ usuarioId, onSuccess, onCancel }: Props) => {
  const [loading, setLoading] = useState(true); // Para carregar dados
  const [saving, setSaving] = useState(false); // Para salvar
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await UserService.returnUser(usuarioId);
        if (data) {
          setNome(data.nome);
          setEmail(data.email);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        onCancel();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [usuarioId, onCancel]);

  const handleSubmit = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e Email são obrigatórios.');
      return;
    }

    // O DTO de atualização do backend (UsuarioRequest) pede apenas nome e email
    const request: UsuarioRequest = {
      nome,
      email,
    };

    try {
      setSaving(true);
      await UserService.updateUser(usuarioId, request);
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      onSuccess();
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        Alert.alert('Erro', 'Este email já está em uso por outra conta.');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar as alterações.');
      }
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
      <Header title="Editar Usuário" onBack={onCancel} />
      <ScrollView style={styles.container}>
        <Input
          label="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Nome completo do usuário"
          editable={!saving}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!saving}
        />

        <Button
          title={saving ? 'Salvando...' : 'Salvar Alterações'}
          onPress={handleSubmit}
          loading={saving}
          disabled={saving}
          variant="success"
        />
        <Button
          title="Cancelar"
          onPress={onCancel}
          disabled={saving}
          variant="ghost"
          style={{marginTop: 10}}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20 
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
});

export default UsuarioFormScreen;
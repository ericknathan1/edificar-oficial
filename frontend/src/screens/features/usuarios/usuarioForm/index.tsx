import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
  Alert, TouchableOpacity, SafeAreaView, ScrollView
} from 'react-native';
import { UsuarioRequest, UsuarioSecurityRequest } from '@/src/core/types/usuario';
import UserService from '@/src/shared/services/usuario';

interface Props {
  usuarioId: number; // ID é obrigatório, pois não há "Criação" aqui
  onSuccess: () => void;
  onCancel: () => void;
}

const UsuarioFormScreen = ({ usuarioId, onSuccess, onCancel }: Props) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  // 1. Busca os dados do usuário para preencher o formulário
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

  // 2. Envia a atualização
  const handleSubmit = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e Email são obrigatórios.');
      return;
    }

    const request: UsuarioRequest = {
      nome,
      email,
      senha:null
    };

    try {
      setSaving(true);
      await UserService.updateUser(usuarioId, request);
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      onSuccess(); // Chama o callback de sucesso
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
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"< Cancelar"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar Usuário</Text>
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome completo do usuário"
          editable={!saving}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!saving}
        />

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={saving}>
          <Text style={styles.buttonText}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// (Use os estilos que defini na resposta anterior para formulário)
const styles = StyleSheet.create({
    fullScreenContainer: { flex: 1, backgroundColor: '#f4f4f8' },
    container: { flex: 1, padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
    backButton: { padding: 8, marginRight: 16 },
    backButtonText: { fontSize: 16, color: '#007bff' },
    title: { fontSize: 22, fontWeight: 'bold' },
    label: { fontSize: 16, color: '#333', marginBottom: 8, fontWeight: '500' },
    input: { height: 50, borderColor: '#D1D1D1', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, fontSize: 16, backgroundColor: '#fff' },
    button: { backgroundColor: '#003F72', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonDisabled: { backgroundColor: '#A0A0A0' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default UsuarioFormScreen;
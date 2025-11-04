import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { UsuarioResponse } from '@/src/core/types/usuario';
import UserService from '@/src/shared/services/usuario';

// Props que o componente pai (UsuarioScreen) vai passar
interface Props {
  usuarioId: number;
  onBack: () => void; // Voltar para a lista
  onEdit: (id: number) => void; // Ir para o formulário de edição
  onDeleteSuccess: () => void; // Voltar para a lista após deletar
}

const UsuarioDetalheScreen = ({ usuarioId, onBack, onEdit, onDeleteSuccess }: Props) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UsuarioResponse | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await UserService.returnUser(usuarioId);
        setUser(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        onBack();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [usuarioId, onBack]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja apagar o usuário "${user?.nome}"? Esta ação mudará o status para APAGADO.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteUser(usuarioId);
              Alert.alert('Sucesso', 'Usuário apagado.');
              onDeleteSuccess(); // Chama o callback de sucesso
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível apagar o usuário.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (!user) {
    return <View style={styles.center}><Text>Usuário não encontrado.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"< Voltar"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Usuário</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.detailTitle}>{user.nome}</Text>
        <Text style={styles.detail}>ID: {user.id}</Text>
        <Text style={styles.detail}>Email: {user.email}</Text>
        <Text style={styles.detail}>Roles: {user.roles.join(', ')}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onEdit(user.id)}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleDelete}>
        <Text style={styles.buttonText}>Apagar (Soft Delete)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// (Use os estilos que defini na resposta anterior para detalhes)
const styles = StyleSheet.create({
    fullScreenContainer: { flex: 1, backgroundColor: '#f0f0f0' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    backButton: { padding: 8, marginRight: 16 },
    backButtonText: { fontSize: 16, color: '#007bff' },
    title: { fontSize: 22, fontWeight: 'bold' },
    card: { backgroundColor: 'white', padding: 20, margin: 16, borderRadius: 10, elevation: 3 },
    detailTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
    detail: { fontSize: 18, color: '#333', marginBottom: 8 },
    button: { backgroundColor: '#3FA9F5', padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 16, marginBottom: 10 },
    deleteButton: { backgroundColor: '#D32F2F' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default UsuarioDetalheScreen;
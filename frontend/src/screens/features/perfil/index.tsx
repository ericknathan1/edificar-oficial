import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { Header } from '@/src/shared/components/ui/header';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons'; // <--- 1. Importe o Ionicons
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: logout }
      ]
    )
  }

  if (!user) {
    return (
      <ScreenContainer style={styles.center}>
        <Text>Usuário não encontrado.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
        <Header title="Meu Perfil" />
        <View style={styles.container}>
            <Card style={styles.card}>
                {/* --- 2. Placeholder da Foto de Perfil --- */}
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={60} color="#003F72" />
                </View>
                
                <Text style={styles.name}>{user.nome}</Text>
                <Text style={styles.detail}><Text style={styles.detailTitle}>ID:</Text> {user.id}</Text>
                <Text style={styles.detail}><Text style={styles.detailTitle}>Email:</Text> {user.email}</Text>
                <Text style={styles.detail}><Text style={styles.detailTitle}>Cargos:</Text> {user.roles.map(role => role.replace("ROLE_", "")).join(', ')}</Text>
            </Card>

            <Button
                title="Sair da Conta"
                onPress={handleLogout}
                variant="danger"
            />
        </View>
    </ScreenContainer>
  );
}

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
  card: {
    marginBottom: 30,
    alignItems: 'center', // Centraliza o conteúdo do card horizontalmente
  },
  // --- 3. Estilos do Avatar ---
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Metade da largura para ficar redondo
    backgroundColor: '#E6F4FE', // Um azul bem claro para o fundo
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
    width: '100%', // Garante que o texto ocupe a largura e alinhe corretamente se não estiver centralizado
    textAlign: 'left', // Mantém os detalhes alinhados à esquerda se preferir, ou center
    paddingHorizontal: 10
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    width: '100%', // Garante que o texto ocupe a largura e alinhe corretamente se não estiver centralizado
    textAlign: 'left', // Mantém os detalhes alinhados à esquerda se preferir, ou center
    paddingHorizontal: 10
  }
});
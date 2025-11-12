import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { Header } from '@/src/shared/components/ui/header';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { useAuth } from '@/src/shared/hooks/useAuth';
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
                <Text style={styles.name}>{user.nome}</Text>
                <Text style={styles.detail}>ID: {user.id}</Text>
                <Text style={styles.detail}>Email: {user.email}</Text>
                <Text style={styles.detail}>Cargos: {user.roles.join(', ')}</Text>
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
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  }
});
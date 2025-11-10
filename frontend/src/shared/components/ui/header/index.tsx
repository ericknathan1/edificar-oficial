import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  onBack?: () => void; // Torna o botão de voltar opcional
}

/**
 * Cabeçalho padronizado para telas internas, com título e botão de voltar.
 */
export const Header = ({ title, onBack }: Props) => {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {/* Espaçador para centralizar o título corretamente se houver botão de voltar */}
      {onBack && <View style={styles.spacer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1, // Permite que o título ocupe o espaço central
  },
  spacer: {
    // Ocupa o mesmo espaço que o botão "Voltar" para centralizar o título
    width: 70, // Ajuste este valor se o texto do botão "Voltar" mudar
  },
});
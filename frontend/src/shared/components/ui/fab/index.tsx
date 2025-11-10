import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress: () => void;
  style?: ViewStyle;
  iconName?: keyof typeof Ionicons.glyphMap; // Permite ícone customizado, com '+' como padrão
}

/**
 * Botão de Ação Flutuante (FAB) para telas de lista.
 * Posiciona-se no canto inferior direito.
 */
export const Fab = ({ onPress, style, iconName = 'add' }: Props) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Ionicons name={iconName} size={32} color="#ffffff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30, // Metade da largura/altura para ser um círculo perfeito
    backgroundColor: '#003F72', // Cor primária
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra (iOS)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Sombra (Android)
    elevation: 8,
  },
});
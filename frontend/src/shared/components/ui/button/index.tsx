import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'warning' | 'ghost' | 'success';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Botão padronizado com variantes de estilo e estado de carregamento.
 */
export const Button = ({ title, onPress, disabled, loading, variant = 'primary', style, textStyle }: Props) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={[styles.buttonText, styles[`${variant}Text`], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Variantes de Cor
  primary: {
    backgroundColor: '#003F72', // Azul principal (do login)
  },
  primaryText: {
    color: '#ffffff',
  },
  danger: {
    backgroundColor: '#dc3545', // Vermelho (deletar)
  },
  dangerText: {
    color: '#ffffff',
  },
  warning: {
    backgroundColor: '#ffc107', // Amarelo (editar)
  },
  warningText: {
    color: '#333',
  },
  success: {
    backgroundColor: '#28a745', // Verde (nova turma)
  },
  successText: {
    color: '#ffffff',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#003F72',
  },
  disabled: {
    backgroundColor: '#A0A0A0',
  },
});
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface Props extends ViewProps {
  children: ReactNode;
}

/**
 * Componente de Card reutilizável com sombra e bordas padronizadas.
 */
export const Card = ({ children, style, ...props }: Props) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
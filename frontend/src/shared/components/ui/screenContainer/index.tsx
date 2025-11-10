import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, ViewStyle, StatusBar } from 'react-native';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}

/**
 * Um container de tela padronizado com SafeAreaView e cor de fundo.
 */
export const ScreenContainer = ({ children, style }: Props) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8', // Cor de fundo padrão
  },
});
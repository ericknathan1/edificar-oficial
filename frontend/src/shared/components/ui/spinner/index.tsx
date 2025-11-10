import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from 'react-native';

interface Props extends ActivityIndicatorProps {
  // Nenhuma prop extra por enquanto
}

/**
 * Um simples ActivityIndicator centralizado com cor padrão.
 */
export const Spinner = ({ ...props }: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#003F72" {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
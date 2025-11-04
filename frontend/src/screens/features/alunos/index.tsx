import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Este é o "default export" que estava faltando
export default function AlunosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Alunos (Placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 }
});
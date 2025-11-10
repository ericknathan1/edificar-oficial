import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Spinner } from '../spinner';

interface Props {
  visible: boolean;
}

/**
 * Um modal de carregamento em tela cheia para bloquear interações.
 */
export const LoadingOverlay = ({ visible }: Props) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}} // Impede fechar no Android
    >
      <View style={styles.overlay}>
        <Spinner size="large" color="#ffffff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
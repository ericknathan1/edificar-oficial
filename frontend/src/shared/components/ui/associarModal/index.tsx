import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from '../button';

interface Item {
    id: number;
    label: string; // Ex: nome do aluno ou professor
}

interface Props {
    visible: boolean;
    title: string;
    items: Item[];
    onConfirm: (selectedId: number) => void;
    onCancel: () => void;
    loading?: boolean;
}

export const AssociarModal = ({ visible, title, items, onConfirm, onCancel, loading }: Props) => {
    const [selectedValue, setSelectedValue] = useState<number | null>(null);

    const handleConfirm = () => {
        if (selectedValue) {
            onConfirm(selectedValue);
        }
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={(val) => setSelectedValue(val)}
                        >
                            <Picker.Item label="Selecione uma opção..." value={null} />
                            {items.map(item => (
                                <Picker.Item key={item.id} label={item.label} value={item.id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.footer}>
                        <Button 
                            title="Cancelar" 
                            onPress={onCancel} 
                            variant="ghost" 
                            style={styles.button} 
                            disabled={loading}
                        />
                        <Button 
                            title="Adicionar" 
                            onPress={handleConfirm} 
                            loading={loading} 
                            disabled={!selectedValue || loading}
                            style={styles.button} 
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    container: { backgroundColor: 'white', borderRadius: 12, padding: 20, elevation: 5 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#003F72', textAlign: 'center' },
    pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 20 },
    footer: { flexDirection: 'row', justifyContent: 'space-between' },
    button: { width: '48%' }
});
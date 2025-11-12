import { AlunoResponse } from '@/src/core/types/alunos';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Importando hooks e componentes de UI
import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { Fab } from '@/src/shared/components/ui/fab';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';
import { useAlunos } from '@/src/shared/hooks/useAlunos';

// Importando as sub-telas (que vamos criar)
import AlunoDetalheScreen from './alunoDetalhe';
import AlunoFormScreen from './alunoForm';

// Enum para Gerenciamento de Estado da Tela
enum ScreenState {
    LISTA,
    DETALHE,
    FORM_NEW,
    FORM_EDIT
}

// Componente de Item da Lista
interface AlunoItemProps {
    item: AlunoResponse;
    onPress: (id: number) => void;
}

const AlunoItem = ({ item, onPress }: AlunoItemProps) => (
    <Card style={styles.itemContainer}>
      <TouchableOpacity onPress={() => onPress(item.id)}>
        <Text style={styles.itemName}>{item.nomeCompleto}</Text>
        <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Responsável: {item.contatoResponsavel}</Text>
            <Text style={styles.itemText}>Status: {item.status}</Text>
        </View>
        <Text style={styles.viewMoreText}>VER DETALHES</Text>
      </TouchableOpacity>
    </Card>
);

// Componente da Tela Principal (Gerenciador de Telas)
export default function AlunosScreen() {
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedAlunoId, setSelectedAlunoId] = useState<number | undefined>(undefined);
    
    // Hook para buscar dados da lista
    const { alunos, isLoading, error, refetch } = useAlunos();

    // --- Funções de Navegação ---
    
    const handleAlunoPress = (id: number) => {
        setSelectedAlunoId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };

    const handleOperationSuccess = () => {
        setSelectedAlunoId(undefined);
        setCurrentScreen(ScreenState.LISTA);
        refetch(); // Força a atualização da lista
    };
    
    const handleCancel = () => {
        setSelectedAlunoId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };

    const goToEdit = (id: number) => {
        setSelectedAlunoId(id);
        setCurrentScreen(ScreenState.FORM_EDIT);
    };

    // --- Renderização do Gerenciador de Telas ---

    if (currentScreen === ScreenState.DETALHE && selectedAlunoId) {
        return (
            <AlunoDetalheScreen 
                alunoId={selectedAlunoId} 
                onBack={handleCancel}
                onEdit={goToEdit}
                onDeleteSuccess={handleOperationSuccess}
            />
        );
    }

    if (currentScreen === ScreenState.FORM_NEW || currentScreen === ScreenState.FORM_EDIT) {
        const idParaForm = currentScreen === ScreenState.FORM_EDIT ? selectedAlunoId : undefined;
        
        return (
            <AlunoFormScreen
                alunoId={idParaForm}
                onSuccess={handleOperationSuccess}
                onCancel={handleCancel}
            />
        );
    }
    
    if (isLoading) {
        return (
            <ScreenContainer style={styles.center}>
                <Spinner size="large" />
                <Text>Carregando alunos...</Text>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Tentar Novamente" onPress={refetch} />
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Alunos</Text>
            </View>
            <FlatList
                data={alunos}
                renderItem={({ item }) => <AlunoItem item={item} onPress={handleAlunoPress} />}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <View style={styles.centerList}>
                        <Text>Nenhum aluno encontrado.</Text>
                    </View>
                }
                contentContainerStyle={alunos.length === 0 ? styles.center : {}}
                ListFooterComponent={<View style={{ height: 80 }} />}
            />
            <Fab onPress={() => setCurrentScreen(ScreenState.FORM_NEW)} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerList: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
    itemContainer: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
    },
    itemDetails: {
        marginTop: 8,
    },
    itemText: {
        fontSize: 14,
        color: '#555',
    },
    viewMoreText: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#007bff',
        textAlign: 'right',
    }
});
import { UsuarioDadosResponse } from '@/src/core/types/usuario';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Importando hooks e componentes de UI
import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';
import { useProfessores } from '@/src/shared/hooks/useProfessores';

// Importando as sub-telas
import ProfessorDetalheScreen from './professorDetalhe';

// Enum para Gerenciamento de Estado da Tela
enum ScreenState {
    LISTA,
    DETALHE,
}

// Componente de Item da Lista
interface ProfessorItemProps {
    item: UsuarioDadosResponse;
    onPress: (id: number) => void;
}

const ProfessorItem = ({ item, onPress }: ProfessorItemProps) => (
    <Card style={styles.itemContainer}>
      <TouchableOpacity onPress={() => onPress(item.id)}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Email: {item.email}</Text>
        </View>
        <Text style={styles.viewMoreText}>VER DETALHES</Text>
      </TouchableOpacity>
    </Card>
);

// Componente da Tela Principal (Gerenciador de Telas)
export default function ProfessoresScreen() {
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedProfessorId, setSelectedProfessorId] = useState<number | undefined>(undefined);
    
    // Hook para buscar dados da lista
    const { professores, isLoading, error, refetch } = useProfessores();

    // --- Funções de Navegação ---
    
    const handleProfessorPress = (id: number) => {
        setSelectedProfessorId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };
    
    const handleBack = () => {
        setSelectedProfessorId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };

    // --- Renderização do Gerenciador de Telas ---

    if (currentScreen === ScreenState.DETALHE && selectedProfessorId) {
        return (
            <ProfessorDetalheScreen 
                professorId={selectedProfessorId} 
                onBack={handleBack}
            />
        );
    }
    
    if (isLoading) {
        return (
            <ScreenContainer style={styles.center}>
                <Spinner size="large" />
                <Text>Carregando professores...</Text>
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
                <Text style={styles.title}>Professores</Text>
            </View>
            <FlatList
                data={professores}
                renderItem={({ item }) => <ProfessorItem item={item} onPress={handleProfessorPress} />}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <View style={styles.centerList}>
                        <Text>Nenhum professor encontrado.</Text>
                    </View>
                }
                contentContainerStyle={professores.length === 0 ? styles.center : {}}
            />
            {/* Não há botão de adicionar, pois são criados via Registro */}
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
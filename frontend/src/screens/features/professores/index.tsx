import { UsuarioDadosResponse } from '@/src/core/types/usuario';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';
import { StatusPadrao } from '@/src/shared/enums/statusPadrao';
import { useProfessores } from '@/src/shared/hooks/useProfessores';
import { formatTitleCase } from '@/src/shared/resources/formatters/fortmatTitleCase';

import ProfessorDetalheScreen from './professorDetalhe';

enum ScreenState {
    LISTA,
    DETALHE,
}

const getStatusColor = (status: StatusPadrao) => {
    switch (status) {
        case StatusPadrao.ATIVO: return '#28a745';
        case StatusPadrao.INATIVO: return '#6c757d';
        default: return '#dc3545';
    }
};

interface ProfessorItemProps {
    item: UsuarioDadosResponse;
    onPress: (id: number) => void;
}

const ProfessorItem = ({ item, onPress }: ProfessorItemProps) => (
    <Card style={styles.itemContainer}>
      <TouchableOpacity onPress={() => onPress(item.id)} activeOpacity={0.7}>
        <View style={styles.itemHeader}>
            <View style={styles.iconContainer}>
                <Ionicons name="briefcase" size={24} color="#003F72" />
            </View>
            
            <View style={styles.headerTextContainer}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemSubtitle}>Professor</Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {formatTitleCase(item.status)}
                </Text>
            </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemFooter}>
            <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={16} color="#666" />
                <Text style={styles.infoText} numberOfLines={1}>{item.email}</Text>
            </View>
            
            <View style={styles.arrowContainer}>
                <Text style={styles.viewMoreText}>Detalhes</Text>
                <Ionicons name="chevron-forward" size={16} color="#007bff" />
            </View>
        </View>
      </TouchableOpacity>
    </Card>
);

export default function ProfessoresScreen() {
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedProfessorId, setSelectedProfessorId] = useState<number | undefined>(undefined);
    
    const { professores, isLoading, error, refetch } = useProfessores();
    
    const handleProfessorPress = (id: number) => {
        setSelectedProfessorId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };
    
    const handleBack = () => {
        setSelectedProfessorId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };

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
                        <Ionicons name="briefcase-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Nenhum professor encontrado.</Text>
                    </View>
                }
                contentContainerStyle={professores.length === 0 ? styles.center : { paddingBottom: 20 }}
            />
        </ScreenContainer>
    );
}

// Estilos idênticos aos de Alunos/Turmas para consistência
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
    emptyText: {
        color: '#888',
        marginTop: 10,
        fontSize: 16,
    },
    itemContainer: {
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 0,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#E6F4FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTextContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 16,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fafafa',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 6,
        fontWeight: '500',
    },
    arrowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewMoreText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#007bff',
        marginRight: 4,
    }
});
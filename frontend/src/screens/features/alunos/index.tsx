import { AlunoResponse } from '@/src/core/types/alunos';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Importando hooks e componentes de UI
import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { Fab } from '@/src/shared/components/ui/fab';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';
import { StatusPadrao } from '@/src/shared/enums/statusPadrao';
import { useAlunos } from '@/src/shared/hooks/useAlunos';
import { formatTitleCase } from '@/src/shared/resources/formatters/fortmatTitleCase';

// Importando as sub-telas
import AlunoDetalheScreen from './alunoDetalhe';
import AlunoFormScreen from './alunoForm';

enum ScreenState {
    LISTA,
    DETALHE,
    FORM_NEW,
    FORM_EDIT
}

const getStatusColor = (status: StatusPadrao) => {
    switch (status) {
        case StatusPadrao.ATIVO: return '#28a745';
        case StatusPadrao.INATIVO: return '#6c757d';
        default: return '#dc3545';
    }
};

interface AlunoItemProps {
    item: AlunoResponse;
    onPress: (id: number) => void;
}

const AlunoItem = ({ item, onPress }: AlunoItemProps) => (
    <Card style={styles.itemContainer}>
      <TouchableOpacity onPress={() => onPress(item.id)} activeOpacity={0.7}>
        <View style={styles.itemHeader}>
            <View style={styles.iconContainer}>
                <Ionicons name="school" size={24} color="#003F72" />
            </View>
            
            <View style={styles.headerTextContainer}>
                <Text style={styles.itemName} numberOfLines={1}>{item.nomeCompleto}</Text>
                <Text style={styles.itemSubtitle}>ID: {item.id}</Text>
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
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.infoText} numberOfLines={1}>{item.contatoResponsavel}</Text>
            </View>
            
            <View style={styles.arrowContainer}>
                <Text style={styles.viewMoreText}>Detalhes</Text>
                <Ionicons name="chevron-forward" size={16} color="#007bff" />
            </View>
        </View>
      </TouchableOpacity>
    </Card>
);

export default function AlunosScreen() {
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedAlunoId, setSelectedAlunoId] = useState<number | undefined>(undefined);
    
    const { alunos, isLoading, error, refetch } = useAlunos();

    const handleAlunoPress = (id: number) => {
        setSelectedAlunoId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };

    const handleOperationSuccess = () => {
        setSelectedAlunoId(undefined);
        setCurrentScreen(ScreenState.LISTA);
        refetch();
    };
    
    const handleCancel = () => {
        setSelectedAlunoId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };

    const goToEdit = (id: number) => {
        setSelectedAlunoId(id);
        setCurrentScreen(ScreenState.FORM_EDIT);
    };

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
                        <Ionicons name="school-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>
                    </View>
                }
                contentContainerStyle={alunos.length === 0 ? styles.center : { paddingBottom: 80 }}
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
    emptyText: {
        color: '#888',
        marginTop: 10,
        fontSize: 16,
    },
    // Estilos do Item (Card)
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
        flex: 1, // Para o texto não empurrar o botão detalhes
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
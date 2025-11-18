import { TurmaResponse } from "@/src/core/types/turma";
import { formatTitleCase } from "@/src/shared/resources/formatters/fortmatTitleCase";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// Importando hooks e componentes de UI
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Fab } from "@/src/shared/components/ui/fab";
import { ScreenContainer } from "@/src/shared/components/ui/screenContainer";
import { Spinner } from "@/src/shared/components/ui/spinner";
// IMPORTANTE: Adicione o novo hook aqui
import { StatusPadrao } from "@/src/shared/enums/statusPadrao";
import { useTurmas, useTurmasApagadas } from "@/src/shared/hooks/useTurmas";

import TurmaDetalheScreen from "./turmaDetalhe";
import TurmaFormScreen from "./turmaForm";

enum ScreenState {
    LISTA,
    LISTA_APAGADAS, // <--- Novo Estado
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

interface TurmaItemProps {
    item: TurmaResponse;
    onPress: (id: number) => void;
}

const TurmaItem = ({ item, onPress }: TurmaItemProps) => (
    <Card style={styles.itemContainer}>
      <TouchableOpacity onPress={() => onPress(item.id)} activeOpacity={0.7}>
        <View style={styles.itemHeader}>
            <View style={[styles.iconContainer, item.statusPadrao === StatusPadrao.APAGADO && styles.iconContainerDeleted]}>
                <Ionicons name={item.statusPadrao === StatusPadrao.APAGADO ? "trash" : "people"} size={24} color={item.statusPadrao === StatusPadrao.APAGADO ? "#dc3545" : "#003F72"} />
            </View>
            
            <View style={styles.headerTextContainer}>
                <Text style={styles.itemName} numberOfLines={1}>{item.nome}</Text>
                <Text style={styles.itemSubtitle}>{item.faixaEtaria}</Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statusPadrao) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.statusPadrao) }]}>
                    {formatTitleCase(item.statusPadrao)}
                </Text>
            </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemFooter}>
            <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{formatTitleCase(item.diaPadrao)}</Text>
            </View>
            
            <View style={styles.arrowContainer}>
                <Text style={styles.viewMoreText}>Detalhes</Text>
                <Ionicons name="chevron-forward" size={16} color="#007bff" />
            </View>
        </View>
      </TouchableOpacity>
    </Card>
);

const TurmaScreen = () => {
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedTurmaId, setSelectedTurmaId] = useState<number | undefined>(undefined);
    
    // Hooks para buscar dados (Ativas e Apagadas)
    const { turmas: turmasAtivas, isLoading: loadingAtivas, error: errorAtivas, refetch: refetchAtivas } = useTurmas();
    const { turmas: turmasApagadas, isLoading: loadingApagadas, error: errorApagadas, refetch: refetchApagadas } = useTurmasApagadas();

    // Determina qual lista mostrar baseado no estado da tela
    const isShowingDeleted = currentScreen === ScreenState.LISTA_APAGADAS;
    const dataToShow = isShowingDeleted ? turmasApagadas : turmasAtivas;
    const isLoading = isShowingDeleted ? loadingApagadas : loadingAtivas;
    const error = isShowingDeleted ? errorApagadas : errorAtivas;
    const refetch = isShowingDeleted ? refetchApagadas : refetchAtivas;

    const handleTurmaPress = (id: number) => {
        setSelectedTurmaId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };

    const handleOperationSuccess = () => {
        setSelectedTurmaId(undefined);
        setCurrentScreen(ScreenState.LISTA);
        refetchAtivas();
        refetchApagadas();
    };
    
    const handleCancel = () => {
        setSelectedTurmaId(undefined);
        // Volta para a lista que estava antes (Ativas ou Apagadas)
        // Mas por simplicidade, voltamos para a lista ativa ou mantemos a lógica simples
        setCurrentScreen(ScreenState.LISTA);
    };

    const goToEdit = (id: number) => {
        setSelectedTurmaId(id);
        setCurrentScreen(ScreenState.FORM_EDIT);
    };
    
    const toggleListMode = () => {
        if (currentScreen === ScreenState.LISTA) {
            setCurrentScreen(ScreenState.LISTA_APAGADAS);
        } else {
            setCurrentScreen(ScreenState.LISTA);
        }
    };

    // --- Renderização ---

    if (currentScreen === ScreenState.DETALHE && selectedTurmaId) {
        return (
            <TurmaDetalheScreen 
                turmaId={selectedTurmaId} 
                onBack={handleCancel}
                onEdit={goToEdit}
                onDeleteSuccess={handleOperationSuccess}
            />
        );
    }

    if (currentScreen === ScreenState.FORM_NEW || currentScreen === ScreenState.FORM_EDIT) {
        const idParaForm = currentScreen === ScreenState.FORM_EDIT ? selectedTurmaId : undefined;
        return (
            <TurmaFormScreen
                turmaId={idParaForm}
                onSuccess={handleOperationSuccess}
                onCancel={handleCancel}
            />
        );
    }
    
    if (isLoading) {
        return (
            <ScreenContainer style={styles.center}>
                <Spinner size="large" />
                <Text>Carregando turmas...</Text>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Tentar Novamente" onPress={refetch} />
                <Button title="Voltar para Lista" onPress={() => setCurrentScreen(ScreenState.LISTA)} variant="ghost" style={{marginTop: 10}} />
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isShowingDeleted ? "Lixeira" : "Turmas"}
                </Text>
                {/* Botão para alternar entre listas */}
                <TouchableOpacity onPress={toggleListMode} style={styles.headerButton}>
                    <Ionicons 
                        name={isShowingDeleted ? "list" : "trash-outline"} 
                        size={24} 
                        color="#003F72" 
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={dataToShow}
                renderItem={({ item }) => <TurmaItem item={item} onPress={handleTurmaPress} />}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <View style={styles.centerList}>
                        <Ionicons name={isShowingDeleted ? "trash-bin-outline" : "school-outline"} size={50} color="#ccc" />
                        <Text style={styles.emptyText}>
                            {isShowingDeleted ? "Nenhuma turma apagada." : "Nenhuma turma ativa."}
                        </Text>
                    </View>
                }
                contentContainerStyle={dataToShow.length === 0 ? styles.center : { paddingBottom: 80 }}
            />
            
            {/* Só mostra o FAB na lista de ativas */}
            {!isShowingDeleted && (
                <Fab onPress={() => setCurrentScreen(ScreenState.FORM_NEW)} />
            )}
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
        flexDirection: 'row', // Para alinhar título e botão
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    headerButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0'
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
    iconContainerDeleted: {
        backgroundColor: '#fee2e2', // Fundo vermelho claro para apagados
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

export default TurmaScreen;
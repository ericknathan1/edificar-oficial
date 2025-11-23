import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import { Alert, BackHandler, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { TurmaResponse } from "@/src/core/types/turma";
import { StatusPadrao } from "@/src/shared/enums/statusPadrao";
import { usePermissions } from "@/src/shared/hooks/usePermissions"; // <--- Novo Import
import { useTurmas, useTurmasApagadas } from "@/src/shared/hooks/useTurmas";
import { formatTitleCase } from "@/src/shared/resources/formatters/fortmatTitleCase";

import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Fab } from "@/src/shared/components/ui/fab";
import { ScreenContainer } from "@/src/shared/components/ui/screenContainer";
import { Spinner } from "@/src/shared/components/ui/spinner";

// --- Importações das Telas Filhas ---
import AulaDetalheScreen from "../aula/aulaDetalhe";
import AulaFormScreen from "../aula/aulaForm";
import TurmaDetalheScreen from "./turmaDetalhe";
import TurmaFormScreen from "./turmaForm";

// Estados da navegação interna
enum ScreenState {
    LISTA,             
    LISTA_APAGADAS,    
    DETALHE,           
    FORM_NEW,          
    FORM_EDIT,         
    AULA_FORM_NEW,     
    AULA_FORM_EDIT,    
    AULA_DETALHE       
}

// Helper de cor para status
const getStatusColor = (status: StatusPadrao) => {
    return status === StatusPadrao.ATIVO ? '#28a745' : status === StatusPadrao.INATIVO ? '#6c757d' : '#dc3545';
};

// Componente visual de item da lista
const TurmaItem = ({ item, onPress }: { item: TurmaResponse, onPress: (id: number) => void }) => (
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

    // Hook de Permissões
    const { isAdmin } = usePermissions(); 

    // Estado principal de navegação
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);

        // --- ADICIONE ESTE BLOCO ---
    useEffect(() => {
        const backAction = () => {
            // Cenario 1: Se estiver em detalhes, form ou aula, VOLTA pra lista
            if (currentScreen !== ScreenState.LISTA) {
                setCurrentScreen(ScreenState.LISTA);
                // Limpa seleções para evitar lixo de estado
                setSelectedTurmaId(undefined);
                setSelectedAulaId(undefined);
                return true; 
            }

            // Cenario 2: Se JÁ estiver na lista (Raiz da tela)
            if (currentScreen === ScreenState.LISTA || currentScreen === ScreenState.LISTA_APAGADAS) {
                // Retornar TRUE aqui impede que o app feche/minimize
                // Retornar FALSE faria o app fechar (comportamento padrão)
                return true; 
            }

            return false;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [currentScreen]);
    
    // IDs selecionados para contexto
    const [selectedTurmaId, setSelectedTurmaId] = useState<number | undefined>(undefined);
    const [selectedAulaId, setSelectedAulaId] = useState<number | undefined>(undefined);
    
    // Hooks de dados
    const { turmas: turmasAtivas, isLoading: loadingAtivas, error: errorAtivas, refetch: refetchAtivos } = useTurmas();
    
    // Só carregamos a lixeira se for admin e se estivermos na tela de lixeira (opcional, mas evita requests desnecessários)
    const { turmas: turmasApagadas, isLoading: loadingApagados, error: errorApagados, refetch: refetchApagados } = useTurmasApagadas();

    // Determina qual lista mostrar
    const isShowingDeleted = currentScreen === ScreenState.LISTA_APAGADAS;
    const dataToShow = isShowingDeleted ? turmasApagadas : turmasAtivas;
    const isLoading = isShowingDeleted ? loadingApagados : loadingAtivas;
    const error = isShowingDeleted ? errorApagados : errorAtivas;

    // --- Navegação Turma ---
    const handleTurmaPress = (id: number) => { setSelectedTurmaId(id); setCurrentScreen(ScreenState.DETALHE); };
    const handleBackToList = () => { setSelectedTurmaId(undefined); setCurrentScreen(ScreenState.LISTA); };
    const handleSuccessTurma = () => { handleBackToList(); refetchAtivos(); refetchApagados(); };
    
    // --- Navegação Aulas ---
    const handleAddAula = () => setCurrentScreen(ScreenState.AULA_FORM_NEW);
    const handleAulaPress = (id: number) => { setSelectedAulaId(id); setCurrentScreen(ScreenState.AULA_DETALHE); };
    const handleBackToTurmaDetalhe = () => { setSelectedAulaId(undefined); setCurrentScreen(ScreenState.DETALHE); };
    const handleEditAula = (id: number) => { setSelectedAulaId(id); setCurrentScreen(ScreenState.AULA_FORM_EDIT); };
    const handleSuccessAula = () => { handleBackToTurmaDetalhe(); };

    // Placeholder Chamada
    const handleChamada = (id: number) => {
        Alert.alert("Em breve", "Tela de Chamada será implementada no próximo passo.");
    };

    // --- Renderização Condicional ---

    if (isLoading) return <ScreenContainer style={styles.center}><Spinner size="large" /><Text>Carregando...</Text></ScreenContainer>;
    if (error) return <ScreenContainer style={styles.center}><Text style={styles.errorText}>{error}</Text><Button title="Tentar Novamente" onPress={refetchAtivos} /></ScreenContainer>;

    // 1. Detalhes da Turma
    if (currentScreen === ScreenState.DETALHE && selectedTurmaId) {
        return (
            <TurmaDetalheScreen 
                turmaId={selectedTurmaId} 
                onBack={handleBackToList}
                onEdit={(id) => { setSelectedTurmaId(id); setCurrentScreen(ScreenState.FORM_EDIT); }}
                onDeleteSuccess={handleSuccessTurma}
                onAddAula={handleAddAula}
                onAulaPress={handleAulaPress}
            />
        );
    }

    // 2. Formulários de Turma
    if ((currentScreen === ScreenState.FORM_NEW || currentScreen === ScreenState.FORM_EDIT)) {
        return (
            <TurmaFormScreen
                turmaId={currentScreen === ScreenState.FORM_EDIT ? selectedTurmaId : undefined}
                onSuccess={handleSuccessTurma}
                onCancel={handleBackToList}
            />
        );
    }

    // 3. Detalhes da Aula
    if (currentScreen === ScreenState.AULA_DETALHE && selectedAulaId) {
        return (
            <AulaDetalheScreen
                aulaId={selectedAulaId}
                onBack={handleBackToTurmaDetalhe}
                onEdit={handleEditAula}
                onChamada={handleChamada}
            />
        );
    }

    // 4. Formulários de Aula
    if (currentScreen === ScreenState.AULA_FORM_NEW || currentScreen === ScreenState.AULA_FORM_EDIT) {
        return (
            <AulaFormScreen
                turmaId={selectedTurmaId!}
                aulaId={currentScreen === ScreenState.AULA_FORM_EDIT ? selectedAulaId : undefined}
                onSuccess={handleSuccessAula}
                onCancel={handleBackToTurmaDetalhe}
            />
        );
    }

    // 5. Lista Principal (Padrão)
    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>{isShowingDeleted ? "Lixeira" : "Turmas"}</Text>
                
                {/* Lógica de Permissão: Apenas Admin vê o botão da lixeira */}
                {isAdmin && (
                    <TouchableOpacity 
                        onPress={() => setCurrentScreen(isShowingDeleted ? ScreenState.LISTA : ScreenState.LISTA_APAGADAS)} 
                        style={styles.headerButton}
                    >
                        <Ionicons name={isShowingDeleted ? "list" : "trash-outline"} size={24} color="#003F72" />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={dataToShow}
                renderItem={({ item }) => <TurmaItem item={item} onPress={handleTurmaPress} />}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={<View style={styles.centerList}><Text style={styles.emptyText}>Nenhuma turma encontrada.</Text></View>}
            />

            {/* Lógica de Permissão: Apenas Admin vê o botão de criar turma (FAB) */}
            {!isShowingDeleted && isAdmin && (
                <Fab onPress={() => setCurrentScreen(ScreenState.FORM_NEW)} />
            )}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    centerList: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    headerButton: { padding: 8, borderRadius: 8, backgroundColor: '#f0f0f0' },
    errorText: { color: 'red', marginBottom: 10 },
    emptyText: { color: '#888', fontSize: 16 },
    itemContainer: { marginVertical: 8, marginHorizontal: 16, padding: 0 },
    itemHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    iconContainer: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#E6F4FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    iconContainerDeleted: { backgroundColor: '#fee2e2' },
    headerTextContainer: { flex: 1 },
    itemName: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 2 },
    itemSubtitle: { fontSize: 14, color: '#666' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 16 },
    itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fafafa', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoText: { fontSize: 14, color: '#555', marginLeft: 6 },
    arrowContainer: { flexDirection: 'row', alignItems: 'center' },
    viewMoreText: { fontSize: 13, fontWeight: '600', color: '#007bff', marginRight: 4 }
});

export default TurmaScreen;
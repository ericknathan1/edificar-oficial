import { TurmaResponse } from "@/src/core/types/turma";
import { formatTitleCase } from "@/src/shared/resources/formatters/fortmatTitleCase";
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
import { useTurmas } from "@/src/shared/hooks/useTurmas";

// Importando as sub-telas
import TurmaDetalheScreen from "./turmaDetalhe";
import TurmaFormScreen from "./turmaForm";

// Enum para Gerenciamento de Estado da Tela
enum ScreenState {
    LISTA,
    DETALHE,
    FORM_NEW,
    FORM_EDIT
}

// Componente de Item da Lista
interface TurmaItemProps {
    item: TurmaResponse;
    onPress: (id: number) => void;
}

const TurmaItem = ({ item, onPress }: TurmaItemProps) => (
    // Usando o componente Card
    <Card style={styles.itemContainer}>
      <TouchableOpacity onPress={() => onPress(item.id)}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Dia: {formatTitleCase(item.diaPadrao)}</Text>
            <Text style={styles.itemText}>Faixa Etária: {item.faixaEtaria}</Text>
            <Text style={styles.itemText}>Status: {formatTitleCase(item.statusPadrao)}</Text>
        </View>
        <Text style={styles.viewMoreText}>VER DETALHES</Text>
      </TouchableOpacity>
    </Card>
);

// Componente da Tela Principal (Gerenciador de Telas)
const TurmaScreen = () => {
    // ESTADOS PARA CONTROLE DE NAVEGAÇÃO INTERNA
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedTurmaId, setSelectedTurmaId] = useState<number | undefined>(undefined);
    
    // ** REFATORAÇÃO PRINCIPAL **
    // Substitui useState, useEffect e carregarTurmas pelo hook
    const { turmas, isLoading, error, refetch } = useTurmas();

    // --- Funções de Navegação e Handlers ---
    
    const handleTurmaPress = (id: number) => {
        setSelectedTurmaId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };

    const handleOperationSuccess = () => {
        setSelectedTurmaId(undefined);
        setCurrentScreen(ScreenState.LISTA);
        // O hook useTurmas já recarrega ao focar,
        // mas podemos forçar se quisermos: refetch();
    };
    
    const handleCancel = () => {
        setSelectedTurmaId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };

    const goToEdit = (id: number) => {
        setSelectedTurmaId(id);
        setCurrentScreen(ScreenState.FORM_EDIT);
    };
    
    // --- Renderização do Gerenciador de Telas ---

    // 1. Tela de Detalhes
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

    // 2. Tela de Formulário (Criação ou Edição)
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
    
    // 3. Tela de Lista (Padrão e Estados de Carregamento/Erro)
    
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
            </ScreenContainer>
        );
    }

    // Renderização da Lista
    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Turmas</Text>
            </View>
            <FlatList
                data={turmas}
                renderItem={({ item }) => <TurmaItem item={item} onPress={handleTurmaPress} />}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <View style={styles.centerList}>
                        <Text>Nenhuma turma encontrada.</Text>
                    </View>
                }
                contentContainerStyle={turmas.length === 0 ? styles.center : {}}
                ListFooterComponent={<View style={{ height: 80 }} />} // Espaço para o FAB
            />
            {/* Botão flutuante para adicionar nova turma */}
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
    centerList: { // Estilo para centralizar o "Nenhum item"
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
        // O Card já tem sombra e padding
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

export default TurmaScreen;
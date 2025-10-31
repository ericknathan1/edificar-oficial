import React, { useState, useEffect, useCallback } from "react";
import { 
    FlatList, 
    Text, 
    View, 
    StyleSheet, 
    ActivityIndicator, 
    SafeAreaView,
    TouchableOpacity 
} from "react-native";

// Importando os componentes de tela e o serviço
import TurmaService from "@/src/shared/services/turma";
import { TurmaResponse } from "@/src/core/types/turma";

// NOVAS TELAS INTEGRADAS
import TurmaDetalheScreen from "./turmaDetalhe"; // Assumindo que você as salvou no mesmo diretório
import TurmaFormScreen from "./turmaForm";    // Assumindo que você as salvou no mesmo diretório

// --- Enum para Gerenciamento de Estado da Tela ---
enum ScreenState {
    LISTA,      // Mostrar a lista de turmas
    DETALHE,    // Mostrar detalhes de uma turma
    FORM_NEW,   // Formulário para criar nova turma
    FORM_EDIT   // Formulário para editar turma existente
}

// --- Componente de Item da Lista (Atualizado para ser clicável) ---
interface TurmaItemProps {
    item: TurmaResponse;
    onPress: (id: number) => void; // Novo prop para lidar com o clique
}

const TurmaItem = ({ item, onPress }: TurmaItemProps) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onPress(item.id)}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Dia: {item.diaPadrao}</Text>
            <Text style={styles.itemText}>Faixa Etária: {item.faixaEtaria}</Text>
            <Text style={styles.itemText}>Status: {item.statusPadrao}</Text>
        </View>
        <Text style={styles.viewMoreText}>VER DETALHES</Text>
    </TouchableOpacity>
);

// --- Componente da Tela Principal (Agora Gerenciador de Telas) ---
const TurmaScreen = () => {
    const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ESTADOS PARA CONTROLE DE NAVEGAÇÃO
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedTurmaId, setSelectedTurmaId] = useState<number | undefined>(undefined);
    
    // Função para carregar os dados (reutilizável)
    const carregarTurmas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await TurmaService.returnTurmasAtivas();
            if (data) {
                setTurmas(data);
            } else {
                setError("Não foi possível carregar as turmas.");
            }
        } catch (err) {
            console.error("Erro na tela TurmaScreen:", err);
            setError("Ocorreu um erro ao buscar os dados.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Carrega dados na montagem e sempre que for para a lista
    useEffect(() => {
        if (currentScreen === ScreenState.LISTA) {
            carregarTurmas();
        }
    }, [currentScreen, carregarTurmas]);


    // --- Funções de Navegação e Handlers ---
    
    // Ação ao clicar em um item da lista
    const handleTurmaPress = (id: number) => {
        setSelectedTurmaId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };

    // Ação após sucesso na criação/edição
    const handleOperationSuccess = () => {
        // Volta para a lista e recarrega para ver a alteração/nova turma
        setSelectedTurmaId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };
    // Ação ao cancelar ou voltar de Detalhe/Formulário
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
            <SafeAreaView style={styles.fullScreenContainer}>
                <TurmaDetalheScreen 
                    turmaId={selectedTurmaId} 
                    onBack={handleCancel} // Volta para a lista
                    onEdit={goToEdit}     // Vai para o formulário de edição
                    onDeleteSuccess={handleOperationSuccess} // NOVO: Volta para a lista após deletar
                />
            </SafeAreaView>
        );
    }

    // 2. Tela de Formulário (Criação ou Edição)
    if (currentScreen === ScreenState.FORM_NEW || currentScreen === ScreenState.FORM_EDIT) {
        const idParaForm = currentScreen === ScreenState.FORM_EDIT ? selectedTurmaId : undefined;
        
        return (
            <SafeAreaView style={styles.fullScreenContainer}>
                <TurmaFormScreen
                    turmaId={idParaForm}
                    onSuccess={handleOperationSuccess} // Usa o callback unificado
                    onCancel={handleCancel}
                />
            </SafeAreaView>
        );
    }
    
    // 3. Tela de Lista (Padrão e Estados de Carregamento/Erro)
    
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Carregando turmas...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                {/* Botão para tentar recarregar */}
                <TouchableOpacity style={styles.retryButton} onPress={carregarTurmas}>
                    <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Renderização da Lista
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Turmas: </Text>
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => setCurrentScreen(ScreenState.FORM_NEW)}
                >
                    <Text style={styles.addButtonText}>+ Nova Turma</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={turmas}
                // Agora passando a função de clique para o item
                renderItem={({ item }) => <TurmaItem item={item} onPress={handleTurmaPress} />}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>Nenhuma turma encontrada.</Text>
                    </View>
                }
                ListFooterComponent={<View style={{ height: 20 }} />}
            />
        </SafeAreaView>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#28a745',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
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
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
import { UsuarioResponse } from "@/src/core/types/usuario";
import UserService from "@/src/shared/services/usuario";

// Importando as telas filhas
import UsuarioDetalheScreen from "./usuariosDetails";
import UsuarioFormScreen from "./usuarioForm";

// Enum para Gerenciamento de Estado da Tela
enum ScreenState {
    LISTA,   // Mostrar a lista de usuários
    DETALHE, // Mostrar detalhes de um usuário
    FORM_EDIT // Formulário para editar usuário existente
    // (Sem FORM_NEW, pois o cadastro é feito na tela de Registro)
}

// Componente de Item da Lista (Clicável)
interface UsuarioItemProps {
    item: UsuarioResponse;
    onPress: (id: number) => void;
}

const UsuarioItem = ({ item, onPress }: UsuarioItemProps) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onPress(item.id)}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Email: {item.email}</Text>
            <Text style={styles.itemText}>Roles: {item.roles.join(', ')}</Text>
        </View>
        <Text style={styles.viewMoreText}>VER DETALHES</Text>
    </TouchableOpacity>
);

// Componente da Tela Principal (Gerenciador de Telas)
const UsuarioScreen = () => {
    const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ESTADOS PARA CONTROLE DE NAVEGAÇÃO
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | undefined>(undefined);
    
    // Função para carregar os dados (reutilizável)
    const carregarUsuarios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Usamos o service de usuário para buscar ativos
            const data = await UserService.returnActiveUsers();
            if (data) {
                setUsuarios(data);
            } else {
                setError("Não foi possível carregar os usuários.");
            }
        } catch (err) {
            console.error("Erro na tela UsuarioScreen:", err);
            setError("Ocorreu um erro ao buscar os dados.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Carrega dados na montagem e sempre que for para a lista
    useEffect(() => {
        if (currentScreen === ScreenState.LISTA) {
            carregarUsuarios();
        }
    }, [currentScreen, carregarUsuarios]);


    // --- Funções de Navegação e Handlers ---
    
    // Ação ao clicar em um item da lista
    const handleUsuarioPress = (id: number) => {
        setSelectedUsuarioId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };

    // Ação após sucesso na edição ou delete
    const handleOperationSuccess = () => {
        setSelectedUsuarioId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };
    
    // Ação ao cancelar ou voltar de Detalhe/Formulário
    const handleCancel = () => {
        setSelectedUsuarioId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };

    // Ação para ir para edição (vinda da tela de Detalhes)
    const goToEdit = (id: number) => {
        setSelectedUsuarioId(id);
        setCurrentScreen(ScreenState.FORM_EDIT);
    };
    
    // --- Renderização do Gerenciador de Telas ---

    // 1. Tela de Detalhes
    if (currentScreen === ScreenState.DETALHE && selectedUsuarioId) {
        return (
            <UsuarioDetalheScreen 
                usuarioId={selectedUsuarioId} 
                onBack={handleCancel}
                onEdit={goToEdit}
                onDeleteSuccess={handleOperationSuccess}
            />
        );
    }

    // 2. Tela de Formulário (Apenas Edição)
    if (currentScreen === ScreenState.FORM_EDIT && selectedUsuarioId) {
        return (
            <UsuarioFormScreen
                usuarioId={selectedUsuarioId}
                onSuccess={handleOperationSuccess}
                onCancel={handleCancel}
            />
        );
    }
    
    // 3. Tela de Lista (Padrão e Estados de Carregamento/Erro)
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Carregando usuários...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={carregarUsuarios}>
                    <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Renderização da Lista
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Usuários</Text>
                {/* O botão "Novo Usuário" foi removido de propósito.
                  A criação é feita pela tela de Registro.
                */}
            </View>
            <FlatList
                data={usuarios}
                renderItem={({ item }) => <UsuarioItem item={item} onPress={handleUsuarioPress} />}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>Nenhum usuário ativo encontrado.</Text>
                    </View>
                }
                ListFooterComponent={<View style={{ height: 20 }} />}
            />
        </SafeAreaView>
    );
}

// (Use os mesmos estilos do seu TurmaScreen)
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

export default UsuarioScreen;
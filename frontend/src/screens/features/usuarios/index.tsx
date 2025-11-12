import { UsuarioResponse } from "@/src/core/types/usuario";
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
import { ScreenContainer } from "@/src/shared/components/ui/screenContainer";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { useUsuarios } from "@/src/shared/hooks/useUsuarios";

// Importando as telas filhas
import UsuarioFormScreen from "./usuarioForm";
import UsuarioDetalheScreen from "./usuariosDetails";

// Enum para Gerenciamento de Estado da Tela
enum ScreenState {
    LISTA,
    DETALHE,
    FORM_EDIT
}

// Componente de Item da Lista
interface UsuarioItemProps {
    item: UsuarioResponse;
    onPress: (id: number) => void;
}

const UsuarioItem = ({ item, onPress }: UsuarioItemProps) => (
    <Card style={styles.itemContainer}>
      <TouchableOpacity onPress={() => onPress(item.id)}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Email: {item.email}</Text>
            <Text style={styles.itemText}>Roles: {item.roles.join(', ')}</Text>
        </View>
        <Text style={styles.viewMoreText}>VER DETALHES</Text>
      </TouchableOpacity>
    </Card>
);

// Componente da Tela Principal (Gerenciador de Telas)
const UsuarioScreen = () => {
    // ESTADOS PARA CONTROLE DE NAVEGAÇÃO
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | undefined>(undefined);
    
    // ** REFATORAÇÃO PRINCIPAL **
    // Substitui useState, useEffect e carregarUsuarios pelo hook
    const { usuarios, isLoading, error, refetch } = useUsuarios();

    // --- Funções de Navegação e Handlers ---
    
    const handleUsuarioPress = (id: number) => {
        setSelectedUsuarioId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };

    const handleOperationSuccess = () => {
        setSelectedUsuarioId(undefined);
        setCurrentScreen(ScreenState.LISTA);
        // O hook recarrega no focus, mas podemos forçar
        refetch();
    };
    
    const handleCancel = () => {
        setSelectedUsuarioId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };

    const goToEdit = (id: number) => {
        setSelectedUsuarioId(id);
        setCurrentScreen(ScreenState.FORM_EDIT);
    };
    
    // --- Renderização do Gerenciador de Telas ---

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

    if (currentScreen === ScreenState.FORM_EDIT && selectedUsuarioId) {
        return (
            <UsuarioFormScreen
                usuarioId={selectedUsuarioId}
                onSuccess={handleOperationSuccess}
                onCancel={handleCancel}
            />
        );
    }
    
    if (isLoading) {
        return (
            <ScreenContainer style={styles.center}>
                <Spinner size="large" />
                <Text>Carregando usuários...</Text>
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
                <Text style={styles.title}>Usuários</Text>
            </View>
            <FlatList
                data={usuarios}
                renderItem={({ item }) => <UsuarioItem item={item} onPress={handleUsuarioPress} />}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <View style={styles.centerList}>
                        <Text>Nenhum usuário ativo encontrado.</Text>
                    </View>
                }
                contentContainerStyle={usuarios.length === 0 ? styles.center : {}}
            />
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

export default UsuarioScreen;
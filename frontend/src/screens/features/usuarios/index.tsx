import { UsuarioResponse } from "@/src/core/types/usuario";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import {
    BackHandler,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Fab } from "@/src/shared/components/ui/fab";
import { ScreenContainer } from "@/src/shared/components/ui/screenContainer";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { StatusUsuario } from "@/src/shared/enums/statusUsuario";
// IMPORTANTE: Adicione useUsuariosApagados
import { useUsuarios, useUsuariosApagados } from "@/src/shared/hooks/useUsuarios";
import { formatTitleCase } from "@/src/shared/resources/formatters/fortmatTitleCase";

import UsuarioFormScreen from "./usuarioForm";
import UsuarioDetalheScreen from "./usuariosDetails";

enum ScreenState {
    LISTA,
    LISTA_APAGADAS, // <--- Novo Estado
    DETALHE,
    FORM_NEW,
    FORM_EDIT
}

const getStatusColor = (status: StatusUsuario) => {
    switch (status) {
        case StatusUsuario.ATIVO: return '#28a745';
        case StatusUsuario.INATIVO: return '#6c757d';
        default: return '#dc3545';
    }
};

interface UsuarioItemProps {
    item: UsuarioResponse;
    onPress: (id: number) => void;
}

const UsuarioItem = ({ item, onPress }: UsuarioItemProps) => (
    <Card style={styles.itemContainer}>
      <TouchableOpacity onPress={() => onPress(item.id)} activeOpacity={0.7}>
        <View style={styles.itemHeader}>
            {/* Ícone condicional */}
            <View style={[styles.iconContainer, item.status === StatusUsuario.APAGADO && styles.iconContainerDeleted]}>
                <Ionicons 
                    name={item.status === StatusUsuario.APAGADO ? "trash" : "shield-checkmark"} 
                    size={24} 
                    color={item.status === StatusUsuario.APAGADO ? "#dc3545" : "#003F72"} 
                />
            </View>
            
            <View style={styles.headerTextContainer}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemSubtitle}>{item.roles.join(', ')}</Text>
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

const UsuarioScreen = () => {
    
    const [currentScreen, setCurrentScreen] = useState(ScreenState.LISTA);
    const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | undefined>(undefined);
    useEffect(() => {
        const backAction = () => {
            // Cenario 1: Se estiver em detalhes, form, VOLTA pra lista
            if (currentScreen !== ScreenState.LISTA && currentScreen !== ScreenState.LISTA_APAGADAS) {
                setCurrentScreen(ScreenState.LISTA);
                setSelectedUsuarioId(undefined);
                return true; 
            }

            // Cenario 2: Se JÁ estiver na lista (Raiz da tela), bloqueia fechar o app
            if (currentScreen === ScreenState.LISTA || currentScreen === ScreenState.LISTA_APAGADAS) {
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
    // Hooks
    const { usuarios: usuariosAtivos, isLoading: loadingAtivos, error: errorAtivos, refetch: refetchAtivos } = useUsuarios();
    const { usuarios: usuariosApagados, isLoading: loadingApagados, error: errorApagados, refetch: refetchApagados } = useUsuariosApagados();

    // Lógica de exibição
    const isShowingDeleted = currentScreen === ScreenState.LISTA_APAGADAS;
    const dataToShow = isShowingDeleted ? usuariosApagados : usuariosAtivos;
    const isLoading = isShowingDeleted ? loadingApagados : loadingAtivos;
    const error = isShowingDeleted ? errorApagados : errorAtivos;
    const refetch = isShowingDeleted ? refetchApagados : refetchAtivos;

    const handleUsuarioPress = (id: number) => {
        setSelectedUsuarioId(id);
        setCurrentScreen(ScreenState.DETALHE);
    };

    const handleOperationSuccess = () => {
        setSelectedUsuarioId(undefined);
        setCurrentScreen(ScreenState.LISTA);
        refetchAtivos();
        refetchApagados();
    };
    
    const handleCancel = () => {
        setSelectedUsuarioId(undefined);
        setCurrentScreen(ScreenState.LISTA);
    };

    const goToEdit = (id: number) => {
        setSelectedUsuarioId(id);
        setCurrentScreen(ScreenState.FORM_EDIT);
    };

    const toggleListMode = () => {
        if (currentScreen === ScreenState.LISTA) {
            setCurrentScreen(ScreenState.LISTA_APAGADAS);
        } else {
            setCurrentScreen(ScreenState.LISTA);
        }
    };
    
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

    if (currentScreen === ScreenState.FORM_NEW || currentScreen === ScreenState.FORM_EDIT) {
        const idParaForm = currentScreen === ScreenState.FORM_EDIT ? selectedUsuarioId : undefined;

        return (
            <UsuarioFormScreen
                usuarioId={idParaForm}
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
                <Button title="Voltar para Lista" onPress={() => setCurrentScreen(ScreenState.LISTA)} variant="ghost" style={{marginTop: 10}} />
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isShowingDeleted ? "Lixeira Usuários" : "Usuários"}
                </Text>
                {/* Botão de Toggle */}
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
                renderItem={({ item }) => <UsuarioItem item={item} onPress={handleUsuarioPress} />}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <View style={styles.centerList}>
                        <Ionicons name={isShowingDeleted ? "trash-bin-outline" : "people-outline"} size={50} color="#ccc" />
                        <Text style={styles.emptyText}>
                            {isShowingDeleted ? "Nenhum usuário na lixeira." : "Nenhum usuário ativo encontrado."}
                        </Text>
                    </View>
                }
                contentContainerStyle={dataToShow.length === 0 ? styles.center : { paddingBottom: 80 }}
            />
            
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
        flexDirection: 'row', // Alinha botão e titulo
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
        backgroundColor: '#fee2e2', // Fundo vermelho claro para itens apagados
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

export default UsuarioScreen;
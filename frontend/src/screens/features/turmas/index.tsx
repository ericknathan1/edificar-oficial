// TurmaScreen.tsx (Renomeei para .tsx para usar TypeScript, já que você tem tipos)

import React, { useState, useEffect } from "react";
import { 
    FlatList, 
    Text, 
    View, 
    StyleSheet, 
    ActivityIndicator, // Para o "loading"
    SafeAreaView 
} from "react-native";

// Importando seu serviço e seu tipo (interface)
import TurmaService from "@/src/shared/services/turma"; // Verifique este caminho
import { TurmaResponse } from "@/src/core/types/turma"; // Verifique este caminho

// --- Componente de Item da Lista ---
// É uma boa prática criar um componente separado para cada item
// O 'item' aqui é um objeto do tipo TurmaResponse
const TurmaItem = ({ item }: { item: TurmaResponse }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Dia: {item.diaPadrao}</Text>
            <Text style={styles.itemText}>Faixa Etária: {item.faixaEtaria}</Text>
            <Text style={styles.itemText}>Status: {item.statusPadrao}</Text>
        </View>
    </View>
);

// --- Componente da Tela Principal ---
const TurmaScreen = () => {
    // Estado para armazenar a lista de turmas
    const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
    // Estado para controlar o indicador de "carregando"
    const [loading, setLoading] = useState(true);
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState<string | null>(null);

    // useEffect com array vazio [] roda apenas UMA VEZ quando o componente é montado
    useEffect(() => {
        // Função interna assíncrona para carregar os dados
        const carregarTurmas = async () => {
            try {
                setLoading(true); // Inicia o carregamento
                setError(null);   // Limpa erros anteriores
                
                const data = await TurmaService.returnTurmas();

                // Seu serviço já tem um try/catch, então se 'data' vier undefined,
                // significa que o serviço capturou um erro.
                if (data) {
                    setTurmas(data);
                } else {
                    setError("Não foi possível carregar as turmas.");
                }

            } catch (err) {
                // Este catch é uma segurança extra
                console.error("Erro na tela TurmaScreen:", err);
                setError("Ocorreu um erro ao buscar os dados.");
            } finally {
                // Independente de sucesso ou erro, para de carregar
                setLoading(false);
            }
        };

        carregarTurmas(); // Chama a função
    }, []);

    // --- Renderização Condicional ---

    // 1. Se estiver carregando, mostra um indicador
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Carregando turmas...</Text>
            </View>
        );
    }

    // 2. Se deu erro, mostra a mensagem de erro
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // 3. Se tudo deu certo, mostra a lista
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Turmas</Text>
                <Text style={styles.subtitle}>Gerenciamento das turmas:</Text>
            </View>
            <FlatList
                data={turmas} // A fonte dos dados
                
                // 'renderItem' pega cada objeto do 'data' e o renderiza
                // usando o componente TurmaItem
                renderItem={({ item }) => <TurmaItem item={item} />} 
                
                // 'keyExtractor' diz ao React como identificar cada item
                // (O 'id' da turma é perfeito para isso)
                keyExtractor={item => item.id.toString()}
                
                // O que mostrar se a lista (turmas) estiver vazia
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>Nenhuma turma encontrada.</Text>
                    </View>
                }
                // Adiciona um espaçamento no final da lista
                ListFooterComponent={<View style={{ height: 20 }} />}
            />
        </SafeAreaView>
    );
}

// --- Estilos ---
// Adicionei alguns estilos básicos para a lista ficar bonita
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
    }
});

export default TurmaScreen;
import React, { useState, useEffect } from "react";
import {
    ScrollView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
} from "react-native";
import { Picker } from '@react-native-picker/picker';

// Importações de tipos e serviço
import TurmaService from "@/src/shared/services/turma";
import { TurmaRequest, TurmaResponse } from "@/src/core/types/turma";
// Importações de Enums (assumindo que estão acessíveis e são strings/números simples)
import { DiaPadrao } from "@/src/shared/enums/diaPadrao"; // Assumindo que este enum existe
// Nota: 'StatusPadrao' não é necessário no 'TurmaRequest'

interface TurmaFormProps {
    turmaId?: number; // Opcional: Se fornecido, a tela é para EDIÇÃO
    onSuccess: (turma: TurmaResponse) => void; // Callback após sucesso (criação/edição)
    onCancel: () => void; // Callback para cancelar e voltar
}

// Valores fixos para o Picker, baseados em DiaPadrao
const diasPadraoOptions = Object.values(DiaPadrao); 

const TurmaFormScreen = ({ turmaId, onSuccess, onCancel }: TurmaFormProps) => {
    // Inicializa o estado com a estrutura de TurmaRequest
    const [formData, setFormData] = useState<TurmaRequest>({
        nome: "",
        faixaEtaria: "",
        // Escolhe o primeiro dia do enum como valor inicial
        diaPadrao: diasPadraoOptions[0] as DiaPadrao, 
    });

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Efeito para carregar dados da turma se for uma EDIÇÃO
    useEffect(() => {
        if (turmaId) {
            setIsEditing(true);
            const loadTurma = async () => {
                setLoading(true);
                try {
                    const data = await TurmaService.returnTurmaById(turmaId);
                    if (data) {
                        // Mapeia TurmaResponse para TurmaRequest
                        setFormData({
                            nome: data.nome,
                            faixaEtaria: data.faixaEtaria,
                            diaPadrao: data.diaPadrao,
                        });
                    } else {
                        Alert.alert("Erro", "Não foi possível carregar os dados da turma para edição.");
                        onCancel();
                    }
                } catch (err) {
                    Alert.alert("Erro", "Falha na comunicação ao buscar turma.");
                    onCancel();
                } finally {
                    setLoading(false);
                }
            };
            loadTurma();
        }
    }, [turmaId, onCancel]);

    // Manipulador de mudança de input
    const handleChange = (key: keyof TurmaRequest, value: string | DiaPadrao) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };
    
    // Manipulador do formulário
    const handleSubmit = async () => {
        setLoading(true);
        try {
            let response: TurmaResponse | undefined;

            if (isEditing && turmaId) {
                // EDIÇÃO
                response = await TurmaService.updateTurma(turmaId, formData);
                if (response) {
                    Alert.alert("Sucesso", "Turma atualizada com sucesso!");
                }
            } else {
                // CRIAÇÃO
                // Usando 'createTurmaSemAula' para evitar a criação automática de aulas, 
                // caso a API ofereça essa opção. Se não, use 'createTurma'.
                response = await TurmaService.createTurma(formData); 
                if (response) {
                    Alert.alert("Sucesso", "Turma criada com sucesso!");
                }
            }

            if (response) {
                onSuccess(response);
            } else {
                // Se o service retornou 'undefined' (por causa do catch interno)
                Alert.alert("Erro", `Não foi possível ${isEditing ? 'atualizar' : 'criar'} a turma. Verifique o console.`);
            }

        } catch (err) {
            console.error("Erro ao submeter o formulário de turma:", err);
            Alert.alert("Erro de API", `Falha ao ${isEditing ? 'atualizar' : 'criar'} a turma.`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Carregando dados para edição...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                {isEditing ? `Editar Turma (ID: ${turmaId})` : "Nova Turma"}
            </Text>

            {/* Nome */}
            <Text style={styles.label}>Nome:</Text>
            <TextInput
                style={styles.input}
                value={formData.nome}
                onChangeText={text => handleChange('nome', text)}
                placeholder="Ex: Ballet Infantil - Manhã"
                autoCapitalize="words"
            />

            {/* Faixa Etária */}
            <Text style={styles.label}>Faixa Etária:</Text>
            <TextInput
                style={styles.input}
                value={formData.faixaEtaria}
                onChangeText={text => handleChange('faixaEtaria', text)}
                placeholder="Ex: 5-8 anos"
                autoCapitalize="none"
            />

            {/* Dia Padrão */}
            <Text style={styles.label}>Dia Padrão:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={formData.diaPadrao}
                    onValueChange={(itemValue) => handleChange('diaPadrao', itemValue as DiaPadrao)}
                    style={styles.picker}
                >
                    {diasPadraoOptions.map(dia => (
                        <Picker.Item key={dia} label={dia} value={dia} />
                    ))}
                </Picker>
            </View>

            {/* Botões */}
            <View style={styles.buttonGroup}>
                <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={onCancel}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {isEditing ? "Salvar Alterações" : "Criar Turma"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        // Ajuste para Android/iOS para garantir que o Picker se comporte bem
        ...(Platform.OS === 'ios' ? { overflow: 'hidden' } : {}), 
    },
    picker: {
        height: 50,
        width: '100%',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TurmaFormScreen;
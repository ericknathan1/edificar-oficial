import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

// Importações de tipos e serviço
import { TurmaRequest, TurmaResponse } from "@/src/core/types/turma";
import { DiaPadrao } from "@/src/shared/enums/diaPadrao";
import TurmaService from "@/src/shared/services/turma";

// Importando hooks e componentes de UI
import { Button } from "@/src/shared/components/ui/button";
import { Header } from "@/src/shared/components/ui/header";
import { Input } from "@/src/shared/components/ui/input";
import { ScreenContainer } from "@/src/shared/components/ui/screenContainer";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { formatTitleCase } from "@/src/shared/resources/formatters/fortmatTitleCase";

interface TurmaFormProps {
    turmaId?: number;
    onSuccess: (turma: TurmaResponse) => void;
    onCancel: () => void;
}

const diasPadraoOptions = Object.values(DiaPadrao); 

const TurmaFormScreen = ({ turmaId, onSuccess, onCancel }: TurmaFormProps) => {
    const [formData, setFormData] = useState<TurmaRequest>({
        nome: "",
        faixaEtaria: "",
        diaPadrao: diasPadraoOptions[0] as DiaPadrao, 
    });

    const [loading, setLoading] = useState(false); // Para carregar dados
    const [saving, setSaving] = useState(false); // Para salvar/criar
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (turmaId) {
            setIsEditing(true);
            const loadTurma = async () => {
                setLoading(true);
                try {
                    const data = await TurmaService.returnTurmaById(turmaId);
                    if (data) {
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

    const handleChange = (key: keyof TurmaRequest, value: string | DiaPadrao) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };
    
    const handleSubmit = async () => {
        if (!formData.nome || !formData.faixaEtaria) {
            Alert.alert("Erro", "Nome e Faixa Etária são obrigatórios.");
            return;
        }

        setSaving(true);
        try {
            let response: TurmaResponse | undefined;

            if (isEditing && turmaId) {
                response = await TurmaService.updateTurma(turmaId, formData);
                if (response) {
                    Alert.alert("Sucesso", "Turma atualizada com sucesso!");
                }
            } else {
                response = await TurmaService.createTurma(formData); 
                if (response) {
                    Alert.alert("Sucesso", "Turma criada com sucesso!");
                }
            }

            if (response) {
                onSuccess(response);
            } else {
                Alert.alert("Erro", `Não foi possível ${isEditing ? 'atualizar' : 'criar'} a turma.`);
            }

        } catch (err) {
            console.error("Erro ao submeter o formulário de turma:", err);
            Alert.alert("Erro de API", `Falha ao ${isEditing ? 'atualizar' : 'criar'} a turma.`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ScreenContainer style={styles.center}>
                <Spinner size="large" />
                <Text>Carregando dados para edição...</Text>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <Header
                title={isEditing ? `Editar Turma` : "Nova Turma"}
                onBack={onCancel}
            />
            <ScrollView style={styles.container}>
                <Input
                    label="Nome:"
                    value={formData.nome}
                    onChangeText={text => handleChange('nome', text)}
                    placeholder="Ex: Ballet Infantil - Manhã"
                    autoCapitalize="words"
                    editable={!saving}
                />

                <Input
                    label="Faixa Etária:"
                    value={formData.faixaEtaria}
                    onChangeText={text => handleChange('faixaEtaria', text)}
                    placeholder="Ex: 5-8 anos"
                    autoCapitalize="none"
                    editable={!saving}
                />

                <Text style={styles.label}>Dia Padrão:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formData.diaPadrao}
                        onValueChange={(itemValue) => handleChange('diaPadrao', itemValue as DiaPadrao)}
                        style={styles.picker}
                        enabled={!saving}
                    >
                        {diasPadraoOptions.map(dia => (
                            <Picker.Item key={dia} label={formatTitleCase(dia)} value={dia} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.buttonGroup}>
                    <Button
                        title="Cancelar"
                        onPress={onCancel}
                        disabled={saving}
                        variant="ghost"
                        style={styles.button}
                    />
                    <Button
                        title={isEditing ? "Salvar Alterações" : "Criar Turma"}
                        onPress={handleSubmit}
                        loading={saving}
                        disabled={saving}
                        style={styles.button}
                        variant={isEditing ? "warning" : "success"}
                    />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        overflow: 'hidden', // Para bordas arredondadas no iOS
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#F9F9F9'
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TurmaFormScreen;
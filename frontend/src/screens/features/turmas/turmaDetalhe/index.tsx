import React, { useState, useEffect } from "react";
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from "react-native";
// Importações de tipos e serviço
import TurmaService from "@/src/shared/services/turma";
import { TurmaResponse } from "@/src/core/types/turma";
import { UsuarioDadosResponse } from "@/src/core/types/usuario";
import { AlunoDadosResponse } from "@/src/core/types/alunos";
import { AulaResponse } from "@/src/core/types/aulas";

interface TurmaDetalheProps {
    turmaId: number; // ID da turma a ser exibida
    onEdit: (id: number) => void; // Função para navegação para edição (já existia)
    onBack: () => void; // Função para voltar (já existia)
    onDeleteSuccess: () => void; // NOVO: Callback após deletar com sucesso
}

const TurmaDetalheScreen = ({ turmaId, onEdit, onBack, onDeleteSuccess }: TurmaDetalheProps) => {
    const [turma, setTurma] = useState<TurmaResponse | null>(null);
    const [professores, setProfessores] = useState<UsuarioDadosResponse[]>([]);
    const [alunos, setAlunos] = useState<AlunoDadosResponse[]>([]);
    const [aulas, setAulas] = useState<AulaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função de Carregamento (Sem alteração)
    const carregarDetalhesTurma = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const turmaData = await TurmaService.returnTurmaById(id);
            if (turmaData) {
                setTurma(turmaData);
                const professoresData = await TurmaService.getProfessoresByTurmaId(id);
                setProfessores(professoresData || []);
                const alunosData = await TurmaService.getAlunoByTurmaId(id);
                setAlunos(alunosData || []);
                const aulasData = await TurmaService.getAulasByTurmaId(id);
                setAulas(aulasData || []);
            } else {
                setError("Turma não encontrada ou erro ao carregar dados.");
                setTurma(null);
            }
        } catch (err) {
            console.error("Erro ao carregar detalhes da turma:", err);
            setError("Ocorreu um erro ao buscar os dados da turma.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDetalhesTurma(turmaId);
    }, [turmaId]);

    // --- NOVO: Lógica de Deletar Turma ---
    const handleDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja deletar a turma "${turma?.nome}"? Esta ação não pode ser desfeita.`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Deletar",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await TurmaService.deleteTurma(turmaId);
                            Alert.alert("Sucesso", "Turma deletada com sucesso.");
                            onDeleteSuccess(); // Chama o callback para voltar à lista e recarregar
                        } catch (err) {
                            console.error("Erro ao deletar turma:", err);
                            Alert.alert("Erro", "Falha ao deletar a turma. Tente novamente.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };
    // ----------------------------------------

    // --- Renderização Condicional (Inalterada) ---
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Carregando detalhes da turma...</Text>
            </View>
        );
    }

    if (error || !turma) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error || "Dados da turma indisponíveis."}</Text>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    const renderProfessores = () => (/* ... código inalterado ... */
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professores ({professores.length})</Text>
            {professores.length > 0 ? (
                professores.map((prof, index) => (
                    <Text key={prof.id} style={styles.listItem}>
                        • {prof.nome} ({prof.email})
                    </Text>
                ))
            ) : (
                <Text style={styles.listItem}>Nenhum professor associado.</Text>
            )}
        </View>
    );

    const renderAlunos = () => (/* ... código inalterado ... */
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alunos Matriculados ({alunos.length})</Text>
            {alunos.length > 0 ? (
                alunos.map((aluno, index) => (
                    <Text key={aluno.id} style={styles.listItem}>
                        • {aluno.nomeCompleto} (Resp: {aluno.contatoResponsavel})
                    </Text>
                ))
            ) : (
                <Text style={styles.listItem}>Nenhum aluno matriculado.</Text>
            )}
        </View>
    );

    const renderAulas = () => (/* ... código inalterado ... */
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas Aulas ({aulas.length})</Text>
            {aulas.length > 0 ? (
                aulas.map((aula, index) => (
                    <Text key={aula.id} style={styles.listItem}>
                        • {new Date(aula.data).toLocaleDateString()} - {aula.horaInicio} ({aula.topico})
                    </Text>
                ))
            ) : (
                <Text style={styles.listItem}>Nenhuma aula agendada.</Text>
            )}
        </View>
    );


    // --- Renderização Principal (Com Botões de Ação) ---
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{"< Voltar"}</Text>
                </TouchableOpacity>
                <Text style={styles.turmaName}>{turma.nome}</Text>
            </View>

            <View style={styles.actionButtons}>
                {/* Botão de Editar */}
                <TouchableOpacity style={styles.editButton} onPress={() => onEdit(turma.id)} disabled={loading}>
                    <Text style={styles.actionButtonText}>Editar Turma</Text>
                </TouchableOpacity>

                {/* Botão de Deletar */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={loading}>
                    <Text style={styles.actionButtonText}>Deletar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>ID:</Text> {turma.id}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Faixa Etária:</Text> {turma.faixaEtaria}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Dia Padrão:</Text> {turma.diaPadrao}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Status:</Text> {turma.statusPadrao}</Text>
            </View>
            
            {renderProfessores()}
            {renderAlunos()}
            {renderAulas()}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

// --- Estilos (Adicionando estilos para os novos botões) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        padding: 5,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007bff',
        fontWeight: '500',
    },
    turmaName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007bff',
        textAlign: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: 10,
    },
    editButton: {
        flex: 1,
        marginRight: 10,
        backgroundColor: '#ffc107', // Amarelo para editar
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButton: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: '#dc3545', // Vermelho para deletar
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    detailsContainer: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 3,
    },
    detailText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#333'
    },
    section: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    listItem: {
        fontSize: 15,
        color: '#666',
        paddingVertical: 3,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});

export default TurmaDetalheScreen;
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
// Importações de tipos e serviço
import TurmaService from "@/src/shared/services/turma";
import { formatTitleCase } from '../../../../shared/resources/formatters/fortmatTitleCase/index';

// Importando hooks e componentes de UI
import { AlertDialog } from "@/src/shared/components/ui/alertDialog";
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Header } from "@/src/shared/components/ui/header";
import { ScreenContainer } from "@/src/shared/components/ui/screenContainer";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { useTurmaDetalhes } from "@/src/shared/hooks/useTurmas";

interface TurmaDetalheProps {
    turmaId: number;
    onEdit: (id: number) => void;
    onBack: () => void;
    onDeleteSuccess: () => void;
}

const TurmaDetalheScreen = ({ turmaId, onEdit, onBack, onDeleteSuccess }: TurmaDetalheProps) => {
    // ** REFATORAÇÃO PRINCIPAL **
    // Substitui useState, useEffect e carregarDetalhesTurma pelo hook
    const { turma, professores, alunos, aulas, isLoading, error, refetch } = useTurmaDetalhes(turmaId);
    
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

    // Lógica de Deletar Turma (agora usa o AlertDialog)
    const handleDelete = () => {
        setIsDeleteAlertVisible(true);
    };

    const confirmDelete = async () => {
        setIsDeleteAlertVisible(false);
        setIsDeleting(true);
        try {
            await TurmaService.deleteTurma(turmaId);
            Alert.alert("Sucesso", "Turma deletada com sucesso.");
            onDeleteSuccess(); // Volta para a lista
        } catch (err) {
            console.error("Erro ao deletar turma:", err);
            Alert.alert("Erro", "Falha ao deletar a turma. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    };

    // --- Renderização Condicional ---
    if (isLoading) {
        return (
            <ScreenContainer style={styles.center}>
                <Spinner size="large" />
                <Text>Carregando detalhes da turma...</Text>
            </ScreenContainer>
        );
    }

    if (error || !turma) {
        return (
            <ScreenContainer style={styles.center}>
                <Text style={styles.errorText}>{error || "Dados da turma indisponíveis."}</Text>
                <Button title="Voltar" onPress={onBack} variant="ghost" />
                <Button title="Tentar Novamente" onPress={refetch} />
            </ScreenContainer>
        );
    }
    
    // --- Sub-componentes de Renderização ---
    const renderProfessores = () => (
        <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Professores ({professores.length})</Text>
            {professores.length > 0 ? (
                professores.map((prof) => (
                    <Text key={prof.id} style={styles.listItem}>
                        • {prof.nome} ({prof.email})
                    </Text>
                ))
            ) : (
                <Text style={styles.listItem}>Nenhum professor associado.</Text>
            )}
        </Card>
    );

    const renderAlunos = () => (
        <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Alunos Matriculados ({alunos.length})</Text>
            {alunos.length > 0 ? (
                alunos.map((aluno) => (
                    <Text key={aluno.id} style={styles.listItem}>
                        • {aluno.nomeCompleto} (Resp: {aluno.contatoResponsavel})
                    </Text>
                ))
            ) : (
                <Text style={styles.listItem}>Nenhum aluno matriculado.</Text>
            )}
        </Card>
    );

    const renderAulas = () => (
        <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas Aulas ({aulas.length})</Text>
            {aulas.length > 0 ? (
                aulas.map((aula) => (
                    <Text key={aula.id} style={styles.listItem}>
                        • {new Date(aula.data).toLocaleDateString()} - {aula.horaInicio} ({aula.topico})
                    </Text>
                ))
            ) : (
                <Text style={styles.listItem}>Nenhuma aula agendada.</Text>
            )}
        </Card>
    );


    return (
        <ScreenContainer>
            {/* Componente Header customizado */}
            <Header title={turma.nome} onBack={onBack} />
            
            <ScrollView style={styles.container}>
                <Card style={styles.detailsContainer}>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Faixa Etária:</Text> {turma.faixaEtaria}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Dia Padrão:</Text> {formatTitleCase(turma.diaPadrao)}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Status:</Text> {formatTitleCase(turma.statusPadrao)}</Text>
                </Card>

                <View style={styles.actionButtons}>
                    <Button 
                        title="Editar Turma" 
                        onPress={() => onEdit(turma.id)} 
                        disabled={isDeleting}
                        variant="warning"
                        style={styles.actionButton}
                    />
                    <Button 
                        title="Deletar" 
                        onPress={handleDelete} 
                        loading={isDeleting}
                        disabled={isDeleting}
                        variant="danger"
                        style={styles.actionButton}
                    />
                </View>
                
                {renderProfessores()}
                {renderAlunos()}
                {renderAulas()}

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Componente AlertDialog customizado */}
            <AlertDialog
                visible={isDeleteAlertVisible}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja deletar a turma "${turma.nome}"? Esta ação não pode ser desfeita.`}
                confirmText="Deletar"
                cancelText="Cancelar"
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteAlertVisible(false)}
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flex: 1, // Faz os botões dividirem o espaço
        marginHorizontal: 5, // Adiciona espaço entre eles
    },
    detailsContainer: {
        marginBottom: 20,
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
        marginBottom: 20,
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
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center'
    },
});

export default TurmaDetalheScreen;
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { StatusAula } from "@/src/shared/enums/statusAula";
import { formatTitleCase } from '@/src/shared/resources/formatters/fortmatTitleCase';
import AlunoService from "@/src/shared/services/aluno";
import ProfessorService from "@/src/shared/services/professor";
import TurmaService from "@/src/shared/services/turma";

import { AlertDialog } from "@/src/shared/components/ui/alertDialog";
import { AssociarModal } from "@/src/shared/components/ui/associarModal"; // Importe o Modal
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Header } from "@/src/shared/components/ui/header";
import { ScreenContainer } from "@/src/shared/components/ui/screenContainer";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { usePermissions } from "@/src/shared/hooks/usePermissions";
import { useTurmaDetalhes } from "@/src/shared/hooks/useTurmas";

interface TurmaDetalheProps {
    turmaId: number;
    onEdit: (id: number) => void;
    onBack: () => void;
    onDeleteSuccess: () => void;
    onAulaPress: (id: number) => void; // Novo callback
    onAddAula: () => void;            // Novo callback
}

const TurmaDetalheScreen = ({ turmaId, onEdit, onBack, onDeleteSuccess, onAulaPress, onAddAula }: TurmaDetalheProps) => {
    const { turma, professores, alunos, aulas, isLoading, error, refetch } = useTurmaDetalhes(turmaId);
    const { isAdmin } = usePermissions();
    
    // Estados para exclusão
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

    // Estados para Associação (Modal)
    const [modalVisible, setModalVisible] = useState(false);
    const [associarType, setAssociarType] = useState<'PROFESSOR' | 'ALUNO' | null>(null);
    const [modalItems, setModalItems] = useState<{id: number, label: string}[]>([]);
    const [modalLoading, setModalLoading] = useState(false);

    const handleDelete = () => setIsDeleteAlertVisible(true);

    const confirmDelete = async () => {
        setIsDeleteAlertVisible(false);
        setIsDeleting(true);
        try {
            await TurmaService.deleteTurma(turmaId);
            Alert.alert("Sucesso", "Turma deletada.");
            onDeleteSuccess();
        } catch (err) {
            Alert.alert("Erro", "Falha ao deletar.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Lógica para abrir o Modal de Associação
    const handleOpenAssociar = async (type: 'PROFESSOR' | 'ALUNO') => {
        setAssociarType(type);
        setModalVisible(true);
        setModalLoading(true);
        try {
            if (type === 'PROFESSOR') {
                const allProfs = await ProfessorService.listarProfessores();
                // Filtra quem já está na turma
                const available = allProfs?.filter(p => !professores.some(existing => existing.id === p.id)) || [];
                setModalItems(available.map(p => ({ id: p.id, label: p.nome })));
            } else {
                const allAlunos = await AlunoService.retornarAlunosAtivos();
                const available = allAlunos?.filter(a => !alunos.some(existing => existing.id === a.id)) || [];
                setModalItems(available.map(a => ({ id: a.id, label: a.nomeCompleto })));
            }
        } catch (e) {
            Alert.alert("Erro", "Falha ao carregar lista.");
            setModalVisible(false);
        } finally {
            setModalLoading(false);
        }
    };

    const handleConfirmAssociar = async (selectedId: number) => {
        setModalLoading(true);
        try {
            if (associarType === 'PROFESSOR') {
                await TurmaService.putProfessorInTurma(turmaId, selectedId);
            } else {
                await TurmaService.putAlunoInTurma(turmaId, selectedId);
            }
            Alert.alert("Sucesso", "Adicionado com sucesso!");
            setModalVisible(false);
            refetch(); // Recarrega os dados da tela
        } catch (e) {
            Alert.alert("Erro", "Falha ao associar.");
        } finally {
            setModalLoading(false);
        }
    };

    // ... (Função auxiliar getStatusColor igual ao anterior) ...
     const getStatusColor = (status: StatusAula) => {
        switch (status) {
            case StatusAula.AGENDADA: return '#007bff'; 
            case StatusAula.EM_ANDAMENTO: return '#28a745'; 
            case StatusAula.FINALIZADA: return '#6c757d'; 
            case StatusAula.CANCELADA: return '#dc3545'; 
            default: return '#333';
        }
    };

    if (isLoading) return <ScreenContainer style={styles.center}><Spinner size="large" /></ScreenContainer>;
    if (error || !turma) return <ScreenContainer style={styles.center}><Text>{error}</Text><Button title="Voltar" onPress={onBack} /></ScreenContainer>;

    return (
        <ScreenContainer>
            <Header title={turma.nome} onBack={onBack} />
            <ScrollView style={styles.container}>
                {/* ... (Card de Detalhes e Botões de Ação igual ao anterior) ... */}
                 <Card style={styles.detailsContainer}>
                    <View style={styles.headerDetailRow}>
                         <View>
                            <Text style={styles.detailLabel}>Faixa Etária</Text>
                            <Text style={styles.detailValue}>{turma.faixaEtaria}</Text>
                         </View>
                         <View>
                            <Text style={styles.detailLabel}>Dia</Text>
                            <Text style={styles.detailValue}>{formatTitleCase(turma.diaPadrao)}</Text>
                         </View>
                         <View>
                             <Text style={styles.detailLabel}>Status</Text>
                            <Text style={[styles.detailValue, {color: turma.statusPadrao === 'ATIVO' ? 'green' : 'red'}]}>
                                {formatTitleCase(turma.statusPadrao)}
                            </Text>
                         </View>
                    </View>
                </Card>

                {/* AÇÕES DA TURMA: Apenas Admin pode Editar ou Deletar a TURMA */}
                {isAdmin && (
                    <View style={styles.actionButtons}>
                        <Button title="Editar Turma" onPress={() => onEdit(turma.id)} variant="warning" style={styles.actionButton} />
                        <Button title="Deletar Turma" onPress={handleDelete} variant="danger" style={styles.actionButton} />
                    </View>
                )}

                {/* Seção de Aulas */}
                <Card style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Aulas ({aulas.length})</Text>
                        <TouchableOpacity onPress={onAddAula}>
                            <Ionicons name="add-circle" size={28} color="#003F72" />
                        </TouchableOpacity>
                    </View>
                    {aulas.length > 0 ? (
                        aulas.map((aula, index) => {
                             const dataAula = new Date(aula.data);
                             const dia = dataAula.getDate();
                             const mes = dataAula.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
                             return (
                            <TouchableOpacity key={aula.id} onPress={() => onAulaPress(aula.id)}>
                                <View style={[styles.aulaItem, index === aulas.length - 1 && { borderBottomWidth: 0 }]}>
                                    <View style={styles.dateBox}>
                                        <Text style={styles.dateDay}>{dia}</Text>
                                        <Text style={styles.dateMonth}>{mes}</Text>
                                    </View>
                                    <View style={styles.aulaContent}>
                                        <Text style={styles.aulaTopic} numberOfLines={1}>{aula.topico || "Sem tópico"}</Text>
                                        <View style={styles.aulaMetaRow}>
                                             <Text style={styles.metaText}>{aula.horaInicio ? aula.horaInicio.substring(0, 5) : '--:--'}</Text>
                                             <View style={[styles.statusBadge, { backgroundColor: getStatusColor(aula.statusAula) + '15' }]}>
                                                <Text style={[styles.statusText, { color: getStatusColor(aula.statusAula) }]}>{aula.statusAula}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                                </View>
                            </TouchableOpacity>
                        )})
                    ) : (
                        <Text style={styles.emptyText}>Nenhuma aula agendada.</Text>
                    )}
                </Card>

                {/* Seção Professores */}
                <Card style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Professores ({professores.length})</Text>
                        {isAdmin && (
                            <TouchableOpacity onPress={() => handleOpenAssociar('PROFESSOR')}>
                                <Ionicons name="person-add" size={24} color="#003F72" />
                            </TouchableOpacity>
                        )}
                    </View>
                    {professores.map(prof => (
                         <View key={prof.id} style={styles.simpleListItem}>
                            <Ionicons name="person-circle-outline" size={24} color="#555" />
                            <Text style={styles.listItemText}>{prof.nome}</Text>
                        </View>
                    ))}
                </Card>

                {/* Seção Alunos */}
                 <Card style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Alunos ({alunos.length})</Text>
                       {isAdmin && (
                            <TouchableOpacity onPress={() => handleOpenAssociar('ALUNO')}>
                                 <Ionicons name="person-add" size={24} color="#003F72" />
                            </TouchableOpacity>
                        )}
                    </View>
                    {alunos.map(aluno => (
                        <View key={aluno.id} style={styles.simpleListItem}>
                            <Ionicons name="school-outline" size={20} color="#555" />
                            <Text style={styles.listItemText}>{aluno.nomeCompleto}</Text>
                        </View>
                    ))}
                </Card>
                <View style={{ height: 40 }} />
            </ScrollView>

            <AlertDialog visible={isDeleteAlertVisible} title="Confirmar Exclusão" message="Deseja apagar a turma?" onConfirm={confirmDelete} onCancel={() => setIsDeleteAlertVisible(false)} />
            
            {/* Modal de Associação */}
            <AssociarModal
                visible={modalVisible}
                title={associarType === 'PROFESSOR' ? "Adicionar Professor" : "Matricular Aluno"}
                items={modalItems}
                loading={modalLoading}
                onConfirm={handleConfirmAssociar}
                onCancel={() => setModalVisible(false)}
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    actionButton: { flex: 1, marginHorizontal: 5 },
    detailsContainer: { marginBottom: 20, paddingVertical: 20 },
    headerDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
    detailLabel: { fontSize: 12, color: '#888', fontWeight: '600', textTransform: 'uppercase' },
    detailValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    section: { marginBottom: 20, padding: 0, overflow: 'hidden' },
    sectionHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fafafa', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#444' },
    aulaItem: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center' },
    dateBox: { width: 45, height: 45, borderRadius: 8, backgroundColor: '#E6F4FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    dateDay: { fontSize: 16, fontWeight: 'bold', color: '#003F72' },
    dateMonth: { fontSize: 9, fontWeight: 'bold', color: '#555' },
    aulaContent: { flex: 1 },
    aulaTopic: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 2 },
    aulaMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 },
    metaText: { fontSize: 12, color: '#666' },
    statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    statusText: { fontSize: 9, fontWeight: 'bold' },
    simpleListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    listItemText: { fontSize: 15, color: '#333', marginLeft: 10 },
    emptyText: { padding: 20, textAlign: 'center', color: '#999', fontStyle: 'italic' },
});

export default TurmaDetalheScreen;
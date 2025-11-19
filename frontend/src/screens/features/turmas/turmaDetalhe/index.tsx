import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
// Importações de tipos e serviço
import { StatusAula } from "@/src/shared/enums/statusAula"; // Importar Enum de Status
import { formatTitleCase } from '@/src/shared/resources/formatters/fortmatTitleCase';
import TurmaService from "@/src/shared/services/turma";

// Importando hooks e componentes de UI
import { AlertDialog } from "@/src/shared/components/ui/alertDialog";
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Header } from "@/src/shared/components/ui/header";
import { ScreenContainer } from "@/src/shared/components/ui/screenContainer";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { useTurmaDetalhes } from "@/src/shared/hooks/useTurmas";
import { Ionicons } from "@expo/vector-icons"; // Importar ícones

interface TurmaDetalheProps {
    turmaId: number;
    onEdit: (id: number) => void;
    onBack: () => void;
    onDeleteSuccess: () => void;
}

const TurmaDetalheScreen = ({ turmaId, onEdit, onBack, onDeleteSuccess }: TurmaDetalheProps) => {
    const { turma, professores, alunos, aulas, isLoading, error, refetch } = useTurmaDetalhes(turmaId);
    
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

    const handleDelete = () => {
        setIsDeleteAlertVisible(true);
    };

    const confirmDelete = async () => {
        setIsDeleteAlertVisible(false);
        setIsDeleting(true);
        try {
            await TurmaService.deleteTurma(turmaId);
            Alert.alert("Sucesso", "Turma deletada com sucesso.");
            onDeleteSuccess();
        } catch (err) {
            console.error("Erro ao deletar turma:", err);
            Alert.alert("Erro", "Falha ao deletar a turma. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Função auxiliar para cor do status
    const getStatusColor = (status: StatusAula) => {
        switch (status) {
            case StatusAula.AGENDADA: return '#007bff'; // Azul
            case StatusAula.EM_ANDAMENTO: return '#28a745'; // Verde
            case StatusAula.FINALIZADA: return '#6c757d'; // Cinza
            case StatusAula.CANCELADA: return '#dc3545'; // Vermelho
            default: return '#333';
        }
    };

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
    
    // --- Renderização das Aulas Melhorada ---
    const renderAulas = () => (
        <Card style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Aulas ({aulas.length})</Text>
                {/* Aqui você pode adicionar um botão "Ver Todas" ou "Adicionar Aula" futuramente */}
            </View>
            
            {aulas.length > 0 ? (
                aulas.map((aula, index) => {
                    const dataAula = new Date(aula.data);
                    const dia = dataAula.getDate();
                    const mes = dataAula.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();

                    return (
                        <View key={aula.id} style={[
                            styles.aulaItem, 
                            index === aulas.length - 1 && { borderBottomWidth: 0 } // Remove borda do último item
                        ]}>
                            {/* Caixa da Data */}
                            <View style={styles.dateBox}>
                                <Text style={styles.dateDay}>{dia}</Text>
                                <Text style={styles.dateMonth}>{mes}</Text>
                            </View>

                            {/* Conteúdo da Aula */}
                            <View style={styles.aulaContent}>
                                <Text style={styles.aulaTopic} numberOfLines={1}>
                                    {aula.topico || "Sem tópico definido"}
                                </Text>
                                
                                <View style={styles.aulaMetaRow}>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="time-outline" size={14} color="#666" />
                                        <Text style={styles.metaText}>
                                            {aula.horaInicio ? aula.horaInicio.substring(0, 5) : '--:--'} - 
                                            {aula.horafim ? aula.horafim.substring(0, 5) : '--:--'}
                                        </Text>
                                    </View>
                                    
                                    {/* Badge de Status */}
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(aula.statusAula) + '15' }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(aula.statusAula) }]}>
                                            {aula.statusAula}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                })
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={40} color="#ccc" />
                    <Text style={styles.emptyText}>Nenhuma aula agendada.</Text>
                </View>
            )}
        </Card>
    );

    const renderProfessores = () => (
        <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Professores ({professores.length})</Text>
            {professores.length > 0 ? (
                professores.map((prof) => (
                    <View key={prof.id} style={styles.simpleListItem}>
                        <Ionicons name="person-circle-outline" size={24} color="#555" />
                        <Text style={styles.listItemText}>{prof.nome}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.emptyText}>Nenhum professor associado.</Text>
            )}
        </Card>
    );

    const renderAlunos = () => (
        <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Alunos ({alunos.length})</Text>
            {alunos.length > 0 ? (
                alunos.map((aluno) => (
                    <View key={aluno.id} style={styles.simpleListItem}>
                        <Ionicons name="school-outline" size={20} color="#555" />
                        <View style={{marginLeft: 8}}>
                            <Text style={styles.listItemText}>{aluno.nomeCompleto}</Text>
                            <Text style={styles.subListItemText}>Responsavel: {aluno.contatoResponsavel}</Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.emptyText}>Nenhum aluno matriculado.</Text>
            )}
        </Card>
    );

    return (
        <ScreenContainer>
            <Header title={turma.nome} onBack={onBack} />
            
            <ScrollView style={styles.container}>
                <Card style={styles.detailsContainer}>
                    <View style={styles.headerDetailRow}>
                         <View>
                            <Text style={styles.detailLabel}>Tema/Faixa-Etária:</Text>
                            <Text style={styles.detailValue}>{turma.faixaEtaria}</Text>
                         </View>
                         <View>
                            <Text style={styles.detailLabel}>Dia Padrão</Text>
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

                <View style={styles.actionButtons}>
                    <Button 
                        title="Editar" 
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
                
                {renderAulas()}
                {renderProfessores()}
                {renderAlunos()}

                <View style={{ height: 40 }} />
            </ScrollView>

            <AlertDialog
                visible={isDeleteAlertVisible}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja deletar a turma "${turma.nome}"?`}
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
        flex: 1,
        marginHorizontal: 5,
    },
    detailsContainer: {
        marginBottom: 20,
        paddingVertical: 20,
    },
    headerDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    detailLabel: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        marginBottom: 4,
        fontWeight: '600'
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        marginBottom: 20,
        padding: 10, // Remove padding do Card para controlar internamente
        overflow: 'hidden'
    },
    sectionHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fafafa'
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
    },
    // Estilos para Aulas
    aulaItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    dateBox: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#E6F4FE', // Azul claro suave
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    dateDay: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003F72', // Azul primário
    },
    dateMonth: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#555',
        marginTop: -2,
    },
    aulaContent: {
        flex: 1,
        justifyContent: 'center',
    },
    aulaTopic: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    aulaMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Estilos Gerais de Lista
    simpleListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    listItemText: {
        fontSize: 15,
        color: '#333',
        marginLeft: 10,
    },
    subListItemText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 10,
    },
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#999',
        marginTop: 10,
        textAlign: 'center',
        fontStyle: 'italic',
        padding: 16
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center'
    },
});

export default TurmaDetalheScreen;
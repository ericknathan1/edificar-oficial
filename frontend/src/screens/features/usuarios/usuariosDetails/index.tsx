import UserService from '@/src/shared/services/usuario';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

// Importando hooks e componentes de UI
import { AlertDialog } from '@/src/shared/components/ui/alertDialog';
import { Button } from '@/src/shared/components/ui/button';
import { Card } from '@/src/shared/components/ui/card';
import { Header } from '@/src/shared/components/ui/header';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';
import { useUsuario } from '@/src/shared/hooks/useUsuarios';

interface Props {
  usuarioId: number;
  onBack: () => void;
  onEdit: (id: number) => void;
  onDeleteSuccess: () => void;
}



const UsuarioDetalheScreen = ({ usuarioId, onBack, onEdit, onDeleteSuccess }: Props) => {
  // ** REFATORAÇÃO PRINCIPAL **
  const { usuario: user, isLoading, error, refetch } = useUsuario(usuarioId);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

  const handleDelete = () => {
    setIsDeleteAlertVisible(true);
  };

  const confirmDelete = async () => {
    if (!user) return;
    setIsDeleteAlertVisible(false);
    setIsDeleting(true);
    try {
      await UserService.deleteUser(user.id);
      Alert.alert('Sucesso', 'Usuário apagado.');
      onDeleteSuccess();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível apagar o usuário.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
        <ScreenContainer style={styles.center}>
            <Spinner size="large" />
            <Text>Carregando usuário...</Text>
        </ScreenContainer>
    );
  }

  if (error || !user) {
    return (
        <ScreenContainer style={styles.center}>
            <Text style={styles.errorText}>{error || 'Usuário não encontrado.'}</Text>
            <Button title="Voltar" onPress={onBack} variant="ghost" />
            <Button title="Tentar Novamente" onPress={refetch} />
        </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title="Detalhes do Usuário" onBack={onBack} />
      
      <View style={styles.container}>
        <Card style={styles.card}>
            <Text style={styles.detailTitle}>{user.nome}</Text>
            <Text style={styles.detail}>ID: {user.id}</Text>
            <Text style={styles.detail}>Email: {user.email}</Text>
            <Text style={styles.detail}>Cargos: {user.roles.join(', ')}</Text>
            <Text style={styles.detail}>Status: {user.status}</Text>
            
            {/* --- LINHA ADICIONADA --- */}
            <Text style={styles.detail}>
              Membro desde: {new Date(user.dataCriacao).toLocaleDateString('pt-BR')}
            </Text>
            {/* --- FIM DA LINHA ADICIONADA --- */}

        </Card>

        <Button 
            title="Editar" 
            onPress={() => onEdit(user.id)} 
            variant="warning"
            style={styles.button}
            disabled={isDeleting}
        />
        <Button 
            title="Apagar"
            onPress={handleDelete}
            variant="danger"
            style={styles.button}
            loading={isDeleting}
            disabled={isDeleting}
        />
      </View>

      <AlertDialog
        visible={isDeleteAlertVisible}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja apagar o usuário "${user?.nome}"? Esta ação mudará o status para APAGADO.`}
        confirmText="Apagar"
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
        alignItems: 'center' 
    },
    card: { 
        padding: 20, 
        marginBottom: 20,
    },
    detailTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 15 
    },
    detail: { 
        fontSize: 18, 
        color: '#333', 
        marginBottom: 8 
    },
    button: { 
        marginBottom: 10 
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center'
    },
});

export default UsuarioDetalheScreen;
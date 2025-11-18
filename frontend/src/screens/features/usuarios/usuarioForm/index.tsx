import { UsuarioRequest, UsuarioSecurityRequest } from '@/src/core/types/usuario';
import { RoleName } from '@/src/shared/enums/roleName'; // Importe o Enum de Roles
import RegisterService from '@/src/shared/services/auth/register'; // Importe o serviço de registro
import UserService from '@/src/shared/services/usuario';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Importando hooks e componentes de UI
import { Button } from '@/src/shared/components/ui/button';
import { Header } from '@/src/shared/components/ui/header';
import { Input } from '@/src/shared/components/ui/input';
import { ScreenContainer } from '@/src/shared/components/ui/screenContainer';
import { Spinner } from '@/src/shared/components/ui/spinner';

interface Props {
  usuarioId?: number; // Tornar opcional
  onSuccess: () => void;
  onCancel: () => void;
}

const UsuarioFormScreen = ({ usuarioId, onSuccess, onCancel }: Props) => {
  const [loading, setLoading] = useState(false); 
  const [saving, setSaving] = useState(false);
  
  // Campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Novo campo
  const [role, setRole] = useState<RoleName>(RoleName.ROLE_PROFESSOR); // Novo campo

  const isEditing = !!usuarioId; // Booleano para saber se é edição

  useEffect(() => {
    if (isEditing && usuarioId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const data = await UserService.returnUser(usuarioId);
          if (data) {
            setNome(data.nome);
            setEmail(data.email);
            // Não setamos senha/role na edição pois a API de retorno geralmente não traz senha, 
            // e a de update deste sistema (UsuarioRequest) não atualiza role/senha.
          }
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [usuarioId, onCancel]);

  const handleSubmit = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e Email são obrigatórios.');
      return;
    }

    // Validação extra para criação
    if (!isEditing && !password) {
       Alert.alert('Erro', 'Senha é obrigatória para novos usuários.');
       return;
    }

    try {
      setSaving(true);

      if (isEditing && usuarioId) {
        // Lógica de Atualização (mantém a original)
        const request: UsuarioRequest = { nome, email };
        await UserService.updateUser(usuarioId, request);
        Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      } else {
        // Lógica de Criação (usa o UsuarioSecurityRequest)
        const request: UsuarioSecurityRequest = {
          nome,
          email,
          senha: password,
          roles: [role]
        };
        await RegisterService.createUser(request);
        Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      }
      
      onSuccess();
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        Alert.alert('Erro', 'Este email já está em uso.');
      } else {
        Alert.alert('Erro', `Não foi possível ${isEditing ? 'salvar' : 'criar'} o usuário.`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <ScreenContainer style={styles.center}>
            <Spinner size="large" />
            <Text>Carregando...</Text>
        </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title={isEditing ? "Editar Usuário" : "Novo Usuário"} onBack={onCancel} />
      <ScrollView style={styles.container}>
        <Input
          label="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Nome completo"
          editable={!saving}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!saving}
        />

        {/* Campos visíveis apenas na CRIAÇÃO */}
        {!isEditing && (
          <>
            <Input
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Crie uma senha"
              secureTextEntry
              editable={!saving}
            />

            <Text style={styles.label}>Tipo de Conta:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === RoleName.ROLE_PROFESSOR && styles.roleButtonActive]}
                onPress={() => setRole(RoleName.ROLE_PROFESSOR)}
                disabled={saving}
              >
                <Text style={[styles.roleText, role === RoleName.ROLE_PROFESSOR && styles.roleTextActive]}>
                  Professor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === RoleName.ROLE_ADMINISTRADOR && styles.roleButtonActive]}
                onPress={() => setRole(RoleName.ROLE_ADMINISTRADOR)}
                disabled={saving}
              >
                <Text style={[styles.roleText, role === RoleName.ROLE_ADMINISTRADOR && styles.roleTextActive]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Button
          title={saving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Usuário')}
          onPress={handleSubmit}
          loading={saving}
          disabled={saving}
          variant="success"
        />
        <Button
          title="Cancelar"
          onPress={onCancel}
          disabled={saving}
          variant="ghost"
          style={{marginTop: 10}}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20 
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    label: {
      fontSize: 16,
      color: '#333',
      marginBottom: 10,
      fontWeight: '500',
    },
    roleContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      gap: 10, // Funciona em versões mais novas do RN, senão use marginHorizontal nos botões
    },
    roleButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#D1D1D1',
      alignItems: 'center',
    },
    roleButtonActive: {
      backgroundColor: '#003F72',
      borderColor: '#003F72',
    },
    roleText: {
      fontSize: 15,
      color: '#003F72',
      fontWeight: 'bold',
    },
    roleTextActive: {
      color: 'white',
    },
});

export default UsuarioFormScreen;
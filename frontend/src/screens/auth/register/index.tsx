import { UsuarioSecurityRequest } from '@/src/core/types/usuario/index';
import { Button } from '@/src/shared/components/ui/button';
import { Input } from '@/src/shared/components/ui/input';
import { useNavigation } from '@/src/shared/constants/router';
import { RoleName } from '@/src/shared/enums/roleName';
import { useAuth } from '@/src/shared/hooks/useAuth';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const RegisterScreen = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const [role, setRole] = useState<RoleName>(RoleName.ROLE_PROFESSOR);
  
  // O hook useAuth já tem um 'loading', mas vamos usar um local
  // para ter controle fino sobre o formulário.
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); // Pega a função de registro

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [validation, setValidation] = useState({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
  });

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setValidation({
      hasLower: /[a-z]/.test(text),
      hasUpper: /[A-Z]/.test(text),
      hasNumber: /\d/.test(text),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(text),
      hasLength: text.length >= 8,
    });
  };

  const handleRegister = async () => {
    if (!nome || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    const allValid = Object.values(validation).every(Boolean);
    if (!allValid) {
      Alert.alert('Senha Fraca', 'Sua senha não atende a todos os requisitos.');
      return;
    }

    setLoading(true);

    const request: UsuarioSecurityRequest = {
      nome: nome,
      email: email,
      senha: password,
      roles: [role],
    };

    try {
      // Usa a função 'register' do hook
      await register(request);
      
      Alert.alert(
        'Sucesso!',
        'Sua conta foi criada. Você será redirecionado para o login.',
        [
          { text: 'OK', onPress: () => navigation.login() },
        ]
      );
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        Alert.alert('Erro no Cadastro', 'Email já cadastrado. Por favor, use outro email.');
      } else {
        Alert.alert('Erro no Cadastro', 'Não foi possível realizar o cadastro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContent}>
          <View style={styles.card}>
            <Text style={styles.title}>Criar Conta</Text>

            <Input
              label="Nome completo"
              placeholder="Nome completo"
              value={nome}
              onChangeText={setNome}
              editable={!loading}
            />

            <Input
              label="Email"
              placeholder="Insira o seu melhor email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!loading}
            />

            <Input
              label="Senha"
              placeholder="Crie uma senha"
              secureTextEntry={true}
              value={password}
              onChangeText={handlePasswordChange}
              onFocus={() => setIsPasswordFocused(true)}
              editable={!loading}
            />

            {(isPasswordFocused || password.length > 0) && (
              <View style={styles.validationContainer}>
                <Text style={[styles.validationText, validation.hasLength ? styles.validationTextValid : styles.validationTextInvalid]}>
                  {validation.hasLength ? '✓' : '•'} Pelo menos 8 caracteres
                </Text>
                <Text style={[styles.validationText, validation.hasLower ? styles.validationTextValid : styles.validationTextInvalid]}>
                  {validation.hasLower ? '✓' : '•'} Uma letra minúscula (a-z)
                </Text>
                <Text style={[styles.validationText, validation.hasUpper ? styles.validationTextValid : styles.validationTextInvalid]}>
                  {validation.hasUpper ? '✓' : '•'} Uma letra maiúscula (A-Z)
                </Text>
                <Text style={[styles.validationText, validation.hasNumber ? styles.validationTextValid : styles.validationTextInvalid]}>
                  {validation.hasNumber ? '✓' : '•'} Um número (0-9)
                </Text>
                <Text style={[styles.validationText, validation.hasSpecial ? styles.validationTextValid : styles.validationTextInvalid]}>
                  {validation.hasSpecial ? '✓' : '•'} Um caractere especial (!@#$)
                </Text>
              </View>
            )}

            <Input
              label="Confirmar Senha"
              placeholder="Confirme a senha"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />

            <Text style={styles.label}>Tipo de Conta:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === RoleName.ROLE_PROFESSOR && styles.roleButtonActive
                ]}
                onPress={() => setRole(RoleName.ROLE_PROFESSOR)}
                disabled={loading}
              >
                <Text style={[
                  styles.roleText,
                  role === RoleName.ROLE_PROFESSOR && styles.roleTextActive
                ]}>
                  Professor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === RoleName.ROLE_ADMINISTRADOR && styles.roleButtonActive
                ]}
                onPress={() => setRole(RoleName.ROLE_ADMINISTRADOR)}
                disabled={loading}
              >
                <Text style={[
                  styles.roleText,
                  role === RoleName.ROLE_ADMINISTRADOR && styles.roleTextActive
                ]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title={loading ? 'Cadastrando...' : 'Cadastrar'}
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Já possui uma conta? </Text>
        <TouchableOpacity onPress={navigation.login} disabled={loading}>
          <Text style={styles.footerLink}>Entre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003F72',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003F72',
    textAlign: 'center',
    marginBottom: 30,
  },
  // Estilo do Input é aplicado dentro do componente
  validationContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  validationText: {
    fontSize: 14,
    lineHeight: 22,
  },
  validationTextInvalid: {
    color: '#D32F2F',
  },
  validationTextValid: {
    color: '#388E3C',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
    paddingLeft: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    alignItems: 'center',
    marginHorizontal: 5,
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
  button: {
    backgroundColor: '#3FA9F5',
    marginTop: 10,
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
  },
  footerLink: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
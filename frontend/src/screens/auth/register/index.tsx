import { UsuarioSecurityRequest } from '@/src/core/types/usuario/index';
import { Button } from '@/src/shared/components/ui/button';
import { Input } from '@/src/shared/components/ui/input';
import { useNavigation } from '@/src/shared/constants/router';
import { RoleName } from '@/src/shared/enums/roleName';
import { useAuth } from '@/src/shared/hooks/useAuth';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
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
  
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

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
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já possui uma conta? </Text>
            <TouchableOpacity onPress={navigation.login} disabled={loading}>
              <Text style={styles.footerLink}>Entre</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003F72',
    // Removido o padding manual do status bar para o Android gerenciar nativamente 
    // ou ser compensado pelo justifyContent
  },
  scrollContainer: {
    flexGrow: 1,
    // Mudança importante: 'center' empurra tudo para o meio, criando espaços iguais em cima e embaixo.
    // Se o conteúdo for grande, isso gera o espaço branco.
    // Vamos manter 'center' mas reduzir o padding do card para compensar.
    justifyContent: 'center', 
    paddingVertical: 20,
  },
  mainContent: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20, // Espaço entre o card e o footer
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    // Ajuste Fino: Padding interno do card reduzido para diminuir altura total
    paddingTop: 25, 
    paddingBottom: 25,
    paddingHorizontal: 20,
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
    fontSize: 28, // Reduzi levemente a fonte do título
    fontWeight: 'bold',
    color: '#003F72',
    textAlign: 'center',
    marginBottom: 25, // Reduzi a margem do título
  },
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
    fontSize: 13, // Reduzi fonte da validação
    lineHeight: 20,
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
    marginBottom: 8,
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
    paddingVertical: 10, // Botões mais compactos
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
    fontSize: 14,
    color: '#003F72',
    fontWeight: 'bold',
  },
  roleTextActive: {
    color: 'white',
  },
  button: {
    backgroundColor: '#3FA9F5',
    marginTop: 5,
  },
  footer: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // Removemos a borda superior para limpar o visual, já que o card cria separação suficiente
    // borderTopWidth: 1, 
    // borderTopColor: 'rgba(255, 255, 255, 0.2)',
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
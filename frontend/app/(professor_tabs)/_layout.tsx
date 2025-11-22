import { usePermissions } from '@/src/shared/hooks/usePermissions';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const { isAdmin } = usePermissions();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#003F72', headerShown: false }}>
      
      {/* Todo mundo vê Turmas (Home) */}
      <Tabs.Screen
        name="turmas/index"
        options={{
          title: 'Turmas',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />

      {/* Todo mundo vê Alunos */}
      <Tabs.Screen
        name="alunos/index"
        options={{
          title: 'Alunos',
          tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />,
        }}
      />

      {/* APENAS ADMIN VÊ: Professores */}
      <Tabs.Screen
        name="professores/index"
        options={{
          title: 'Professores',
          // Se não for admin, href é null (o botão some). Se for admin, usa o comportamento padrão (undefined) ou o caminho explícito.
          href: isAdmin ? '/professores' : null, 
          tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} />,
        }}
      />

      {/* APENAS ADMIN VÊ: Usuários (Sistema) */}
      <Tabs.Screen
        name="usuarios/index"
        options={{
          title: 'Usuários',
          href: isAdmin ? '/usuarios' : null,
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />

      {/* Todo mundo vê Perfil */}
      <Tabs.Screen
        name="perfil/index"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} />,
        }}
      />

      {/* Esconde a rota index padrão para evitar duplicidade visual se existir */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
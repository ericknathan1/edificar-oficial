import { Tabs } from "expo-router";

export default function TabLayout(){
    return (
        <Tabs screenOptions={{headerShown:false}}>
            <Tabs.Screen name="turmas"/>
            <Tabs.Screen name="alunos"/>
            <Tabs.Screen name="professores"/>
            <Tabs.Screen name="usuarios"/>
            <Tabs.Screen name="perfil"/>
        </Tabs>
    )
}
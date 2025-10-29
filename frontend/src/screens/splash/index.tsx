import { StyleSheet, Text, View } from "react-native"


const SplashScreen = () => {
    return (
        <View>
            <Text>Edificar</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#003F72"
    },
    text: {
        fontSize: 40
    }
})

export default SplashScreen;
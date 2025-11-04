import { Image, StyleSheet, Text, View } from "react-native"


const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require("../../../assets/images/logo_splash_2.png")}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#003F72",
        width: "100%",
        height: "100%",
        padding: 0,
        margin: 0, 
    },
    logo: {
        width: 400,
        height: 400,
        resizeMode: 'contain'
    }
})

export default SplashScreen;
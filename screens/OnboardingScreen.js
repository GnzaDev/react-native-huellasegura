import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";


const OnboardingScreen = ({ navigation }) => {
  let swiperRef;

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <Swiper
      ref={(ref) => {
        swiperRef = ref;
      }}
      style={styles.wrapper}
      showsButtons={false}
      loop={false}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
    >
      <View style={styles.slide}>
        <Image
          source={require("../assets/onboarding3.png")}
          style={styles.image}
        />
        <Text style={styles.title}>
          Lee las reseñas de veterinarias cercanas
        </Text>
        <Text style={styles.subtitle}>
          Descubre lo que otros usuarios opinan sobre los servicios de
          veterinarias cerca de ti.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#28a745",
  },
  image: {
    width: "80%",
    height: "40%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
  },
  dot: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#ff8c00",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});

export default OnboardingScreen;

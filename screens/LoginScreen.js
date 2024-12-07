import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../credenciales";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Obtener el rol del usuario
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          navigation.navigate("HuellaSegura"); // Admin puede ver el CRUD
        } else {
          navigation.navigate("HuellaSegura"); // Visitante solo puede ver reseñas
        }
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WELCOME!!!</Text>
      <View style={styles.whiteBox}>
        <TextInput
          style={styles.input}
          placeholder="Username / Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <Button title="Login" onPress={handleLogin} color="#28a745" />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Register")}
        >
          Don't have an Account? Register
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    borderRadius: 25,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  link: {
    marginTop: 10,
    color: "#aaa",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    padding: 10,
  },
  message: { marginTop: 10, textAlign: "center", color: "green", fontSize: 16 },
  button: {
    backgroundColor: "#28a745",
    borderRadius: 50,
    padding: 10,
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#28a745",
  },
  whiteBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textShadowColor: "#aaa",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

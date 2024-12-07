import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../credenciales";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const db = getFirestore();

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View style={styles.whiteBox}>
        <TextInput
          style={styles.input}
          placeholder="Email"
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
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.roleText}>
            {role ? `Selected Role: ${role}` : "Select Role"}
          </Text>
        </TouchableOpacity>

        <Button title="Register" onPress={handleRegister} color="#28a745" />
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Already have an account? Login here
        </Text>
      </View>

      {/* Modal para seleccionar el rol */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Role:</Text>
          <TouchableOpacity
            onPress={() => {
              setRole("admin");
              setModalVisible(false);
            }}
          >
            <Text style={styles.modalOption}>Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setRole("visitor");
              setModalVisible(false);
            }}
          >
            <Text style={styles.modalOption}>Visitor</Text>
          </TouchableOpacity>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#28a745", // Color del texto
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
  roleButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  roleText: { color: "black" },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: { marginBottom: 15, textAlign: "center" },
  modalOption: { marginVertical: 10, fontSize: 18 },
});

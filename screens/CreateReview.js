import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import appFirebase from "../credenciales";
import { auth } from "../credenciales";
import { getDoc, doc } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function CreateReview(props) {
  const [state, setState] = useState({
    nombre: "",
    comentario: "",
    calificacion: "",
  });

  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          Alert.alert(
            "Acceso Denegado",
            "Solo los administradores pueden crear reseñas."
          );
          props.navigation.navigate("ListReviews");
        }
      }
    };
    checkUserRole();

    props.navigation.setOptions({ headerShown: false });
  }, [props.navigation]);

  const handleChangeText = (key, value) => {
    setState({ ...state, [key]: value });
  };

  const saveReview = async () => {
    if (!state.nombre || !state.comentario || !state.calificacion) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    const calificacionNum = parseInt(state.calificacion);
    if (calificacionNum < 1 || calificacionNum > 5) {
      Alert.alert("Error", "La calificación debe ser un número entre 1 y 5.");
      return;
    }
    if (isNaN(calificacionNum)) {
      Alert.alert("Error", "La calificación debe ser un número.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "reviews"), {
        ...state,
        calificacion: parseInt(state.calificacion),
      });
      Alert.alert("Éxito", "Reseña guardada con éxito.");
      props.navigation.navigate("HuellaSegura", { refresh: true });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al guardar la reseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Crear Reseña</Text>
      <View style={styles.adminMessageContainer}>
        <Text style={styles.adminMessage}>
          {isAdmin ? "Eres un administrador" : "Eres un visitante"}
        </Text>
      </View>
      <TextInput
        placeholder="Nombre"
        value={state.nombre}
        onChangeText={(value) => handleChangeText("nombre", value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Comentario"
        value={state.comentario}
        onChangeText={(value) => handleChangeText("comentario", value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Calificación (1-5)"
        value={state.calificacion}
        keyboardType="numeric"
        onChangeText={(value) => handleChangeText("calificacion", value)}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <Button title="Guardar Reseña" onPress={saveReview} color="#4CAF50" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#F7F9FB",
    justifyContent: "center",
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "#4CAF50",
  },
  adminMessage: {
    fontSize: 18,
    backgroundColor: "#65ff91",
    borderRadius: 20,
    width: 200,
    textAlign: "center",
    fontWeight: "500",
    color: "#333333",
    marginBottom: 10,
  },
  adminMessageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});

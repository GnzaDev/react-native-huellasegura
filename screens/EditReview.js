import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";

import appFirebase from "../credenciales"; // Archivo que configura Firebase
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../credenciales"; // Importar auth para obtener el usuario actual

const db = getFirestore(appFirebase);

export default function EditReview(props) {
  const [review, setReview] = useState({
    nombre: "",
    comentario: "",
    calificacion: "",
  });
  const [loading, setLoading] = useState(true); // Indicador de carga para obtener datos
  const [saving, setSaving] = useState(false); // Indicador de carga para guardar cambios
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es admin

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
            "Solo los administradores pueden editar reseñas."
          );
          props.navigation.navigate("HuellaSegura");
        }
      }
    };
    checkUserRole();
    props.navigation.setOptions({ headerShown: false });
  }, [props.navigation]);

  // Obtener los datos de la reseña actual
  const getReviewData = async (id) => {
    try {
      const docRef = doc(db, "reviews", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReview(docSnap.data()); // Establecer los datos de la reseña en el estado
      }
      setLoading(false); // Finaliza la carga
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const reviewId = props.route.params.reviewId; // Recoge el ID pasado desde ShowReview
    getReviewData(reviewId);
  }, []);

  // Función para manejar los cambios en el formulario
  const handleChangeText = (value, field) => {
    setReview({ ...review, [field]: value });
  };

  // Función para guardar los cambios
  const saveUpdatedReview = async () => {
    if (!review.nombre || !review.comentario || !review.calificacion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (
      isNaN(review.calificacion) ||
      review.calificacion < 1 ||
      review.calificacion > 5
    ) {
      Alert.alert("Error", "La calificación debe ser un número entre 1 y 5");
      return;
    }

    setSaving(true); // Activa el indicador de guardado
    try {
      const reviewId = props.route.params.reviewId; // Obtén el ID de la reseña
      const docRef = doc(db, "reviews", reviewId); // Referencia al documento en Firestore

      // Actualiza la reseña en Firestore
      await setDoc(docRef, {
        nombre: review.nombre,
        comentario: review.comentario,
        calificacion: parseInt(review.calificacion), // Asegúrate de guardar como número
      });

      Alert.alert("Éxito", "Reseña modificada con éxito");
      props.navigation.navigate("HuellaSegura", { refresh: true }); // Regresar a la lista de reseñas
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al guardar los cambios");
    } finally {
      setSaving(false); // Desactiva el indicador de guardado
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando reseña...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
      
      <View style={styles.adminMessageContainer}>
        <Text style={styles.adminMessage}>
          {isAdmin ? "Eres un administrador" : "Eres un visitante"}
        </Text>
      </View>

      <Text style={styles.title}>Modificar Reseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#888"
        value={review.nombre}
        onChangeText={(value) => handleChangeText(value, "nombre")}
      />
      <TextInput
        style={styles.input}
        placeholder="Comentario"
        placeholderTextColor="#888"
        value={review.comentario}
        onChangeText={(value) => handleChangeText(value, "comentario")}
      />
      <TextInput
        style={styles.input}
        placeholder="Calificación (1-5)"
        placeholderTextColor="#888"
        value={String(review.calificacion)} // Convertir a string para evitar errores en el componente
        onChangeText={(value) => handleChangeText(value, "calificacion")}
        keyboardType="numeric"
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <Button
          title="Guardar cambios"
          onPress={saveUpdatedReview}
          color="#4CAF50"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F7F9FB",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
    marginBottom: 20,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FB",
  },
  loadingText: {
    color: "#333",
    fontSize: 18,
    marginTop: 10,
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
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import appFirebase from "../credenciales";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { auth } from "../credenciales";

const db = getFirestore(appFirebase);

export default function ShowReview(props) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const getReviewData = async (id) => {
    try {
      const docRef = doc(db, "reviews", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReview(docSnap.data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const reviewId = props.route.params.reviewId;
    getReviewData(reviewId);
    checkUserRole();
    props.navigation.setOptions({ headerShown: false });
  }, [props.route.params.reviewId, props.navigation]);

  const checkUserRole = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        setIsAdmin(true);
      }
    }
  };

  const confirmDeleteReview = (id) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar esta reseña?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => deleteReview(id) },
      ],
      { cancelable: true }
    );
  };

  const deleteReview = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "reviews", id));
      Alert.alert("Éxito", "Reseña eliminada con éxito");
      props.navigation.navigate("HuellaSegura", { refresh: true });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Hubo un error al eliminar la reseña");
    } finally {
      setLoading(false);
    }
  };

  if (!review) {
    return <Text style={styles.loadingText}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de la Reseña</Text>
      <View style={styles.adminMessageContainer}>
        <Text style={styles.adminMessage}>
          {isAdmin ? "Eres un administrador" : "Eres un visitante"}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{review.nombre}</Text>
        <Text style={styles.label}>Comentario:</Text>
        <Text style={styles.value}>{review.comentario}</Text>
        <Text style={styles.label}>Calificación:</Text>
        <Text style={styles.value}>⭐ {review.calificacion}</Text>
      </View>

      {isAdmin && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              props.navigation.navigate("EditReview", {
                reviewId: props.route.params.reviewId,
              })
            }
          >
            <Icon name="edit" size={20} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#EF5350" />
          ) : (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDeleteReview(props.route.params.reviewId)}
            >
              <Icon
                name="delete"
                size={20}
                color="#FFFFFF"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: "#333333",
    paddingTop: 70,
  },
  detailContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555555",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 10,
  },
  buttonsContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA726",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF5350",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
    color: "#888888",
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "#4CAF50",
  },
});

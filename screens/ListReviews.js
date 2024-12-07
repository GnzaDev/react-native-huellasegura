import React, { useState, useEffect, useCallback } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth, signOut } from "../credenciales"; // Importar auth para obtener el usuario actual
import { getDoc, doc } from "firebase/firestore";


const db = getFirestore();

const ListReviews = (props) => {
  const [lista, setLista] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es admin

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Cerrar sesión',
              '¿Estás seguro de que deseas cerrar sesión?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar sesión', onPress: cerrarSesion },
              ]
            );
          }}
          style={styles.logoutButton}
        >
          <Icon name="log-out-outline" size={36} color="black" />
        </TouchableOpacity>
      ),
    });
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        }
      }
    };
    checkUserRole();
  }, []);

  const getLista = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const docs = [];
      querySnapshot.forEach((doc) => {
        const { nombre, comentario, calificacion } = doc.data();
        docs.push({
          id: doc.id,
          nombre,
          comentario,
          calificacion,
        });
      });
      setLista(docs);
      setFilteredList(docs); // Inicialmente, la lista filtrada es igual a la lista completa
    } catch (error) {
      console.log(error);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      console.log('Sesión cerrada');
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => null, // Elimina la flecha
    });
    getLista();
  }, []);

  useEffect(() => {
    if (props.route.params?.refresh) {
      getLista(); // Volver a cargar la lista si se pasa el parámetro refresh
    }
  }, [props.route.params]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = lista.filter((item) =>
      item.nombre.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filteredData);
  };

  const handleBackPress = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí", onPress: () => props.navigation.navigate("Login") },
      ]
    );
    return true; // Prevenir la acción predeterminada
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    
    <View style={styles.container}>
      
      <View style={styles.adminMessageContainer}>
        <Text style={styles.adminMessage}>
          {isAdmin ? "Eres un administrador" : "Eres un visitante"}
        </Text>
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <ScrollView>
        <View>
          <Text style={styles.title}>Reseñas de Veterinarias</Text>
        </View>
        <View>
          {filteredList.map((list) => (
            <TouchableOpacity
              key={list.id}
              style={styles.reviewButton}
              onPress={() =>
                props.navigation.navigate("ShowReview", { reviewId: list.id })
              }
            >
              <Text style={styles.reviewText}>
                {list.nombre} - ⭐ {list.calificacion}
              </Text>
              <Text style={styles.commentText}>{list.comentario}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {isAdmin && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => props.navigation.navigate("CreateReview")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Comunidad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Notificaciones</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListReviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 80,
    right: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  reviewButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  reviewText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4A4A4A",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    color: "#7A7A7A",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    height: 60,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
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
  logoutButton: {
    position: "absolute",
    top: 5,
    right: 10,
    width: 60,
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

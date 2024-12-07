import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Importando los componentes
import CreateReview from "./screens/CreateReview";
import ListReviews from "./screens/ListReviews";
import ShowReview from "./screens/ShowReview";
import EditReview from "./screens/EditReview";
import LoginScreen from "./screens/LoginScreen"; // Importar la pantalla de inicio de sesión
import RegisterScreen from "./screens/RegisterScreen";
import OnboardingScreen from "./screens/OnboardingScreen";

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="HuellaSegura" component={ListReviews} />
        <Stack.Screen name="CreateReview" component={CreateReview} />
        <Stack.Screen name="ShowReview" component={ShowReview} />
        <Stack.Screen name="EditReview" component={EditReview} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
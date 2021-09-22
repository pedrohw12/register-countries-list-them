import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  ScrollView,
  Image,
} from "react-native";

// Logo
import Logo from "./assets/logo.png";

export default function App() {
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countriesList, setCountriesList] = useState([]);

  useEffect(() => {
    async function fetchSavedCountries() {
      let fetchedCountries = [];
      let counter = 0;
      const savedKeys = await AsyncStorage.getAllKeys();

      for (let i = 0; i < savedKeys.length; i++) {
        const country = await AsyncStorage.getItem(savedKeys[i]);
        fetchedCountries.push(country);
        counter = counter + 1;
      }

      if (counter === savedKeys.length && counter > 0) {
        setCountriesList(fetchedCountries);
      }
    }

    fetchSavedCountries();
  }, []);

  async function handleSaveCountry() {
    if (!countryCode) {
      return Alert.alert("Ops!", "Você precisa definir um código para o país", [
        { text: "OK" },
      ]);
    }

    if (!countryName) {
      return Alert.alert("Ops!", "Você precisa definir um nome para o país", [
        { text: "OK" },
      ]);
    }

    try {
      await AsyncStorage.setItem(countryCode, `${countryCode}-${countryName}`);

      Alert.alert("Sucesso!", "País cadastrado!", [{ text: "OK" }]);

      setCountryName("");
      setCountryCode("");
      setCountriesList([...countriesList, `${countryCode}-${countryName}`]);
    } catch (error) {
      console.log(error);
      Alert.alert("Ops!", "Algo deu errado. Tente novamente.", [
        { text: "OK" },
      ]);
    }
  }

  async function handleDeleteCountries() {
    try {
      await AsyncStorage.clear();

      Alert.alert("Sucesso!", "Dados excluídos.", [{ text: "OK" }]);
      setCountriesList([]);
    } catch (error) {
      Alert.alert("Ops!", "Algo deu errado. Tente novamente.", [
        { text: "OK" },
      ]);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Text style={styles.title}>Cadastro de países por código</Text>
      <Image style={styles.logo} source={Logo} />
      <TextInput
        style={styles.input}
        placeholder="Código do país"
        onChangeText={(txt) => setCountryCode(txt)}
        value={countryCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do país"
        onChangeText={(txt) => setCountryName(txt)}
        value={countryName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveCountry}>
        <Text style={styles.buttonText}>Cadastrar país</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteCountries}
      >
        <Text style={styles.buttonText}>Excluir países</Text>
      </TouchableOpacity>
      <View style={styles.countriesListView}>
        {countriesList.map((item, index) => (
          <TouchableOpacity key={index} style={styles.countryButton}>
            <Text style={styles.cardTxt}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 25,
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    height: 60,
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#44bd32",
    width: "100%",
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#c23616",
    width: "100%",
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  countryButton: {
    backgroundColor: "#fbc531",
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  cardTxt: {
    fontSize: 20,
  },
  countriesListView: {
    width: "100%",
    marginBottom: 50,
  },
});

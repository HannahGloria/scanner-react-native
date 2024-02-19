import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
//import Tts from "react-native-tts";
import * as Speech from "expo-speech";

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [text, setText] = useState(""); //el que escaneo

  const [ttsInitialized, setTtsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setText(data);
    console.log(`Data: ${data}`);
    console.log(`Type: ${type}`);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Por favor acepte los permisos.</Text>
      </View>
    );
  }

  let speakHi;
  if (text != null) {
    speakHi = () => {
      const texto = text;
      const options = {
        language: "es",
        pitch: 1,
        rate: 1,
        voice: "es-ES-Standard-A",
      };
      Speech.speak(texto, options);
    };
  } else {
    speakHi = () => {
      const texto = "No hay texto";
      const options = {
        language: "es",
        pitch: 1,
        rate: 1,
        voice: "es-ES-Standard-A",
      };
      Speech.speak(texto, options);
    };
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={text ? undefined : handleBarCodeScanned}
        /*Si text tiene un valor, el escaneo de código de barras no activará la función handleBarCodeScanned; 
        de lo contrario, lo activará. */
      />

      {text && ( //si text tiene un valor truthy se renderiza el siguiente bloque
        <View style={styles.divAlert}>
          <Text style={styles.textAlert}>Data: {text}</Text>
          <Button title="Scan Again?" onPress={() => setText("")} />
          {/*AUDIO*/}

          <Button title="Speak" onPress={speakHi} />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  divAlert: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  textAlert: {
    fontSize: 20,
    margin: 10,
  },
});

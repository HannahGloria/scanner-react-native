import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Aún no se ha escaneado nada");
  const cameraRef = useRef(null); //

  const askForCameraPermission = async () => {
    //
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasPermission(status === "granted");
  };

  // useEffect(() => {
  //   const askForCameraPermission = async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   };

  //   askForCameraPermission();
  // }, []);
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // const handleCameraCapture = async ({ uri }) => {
  //   setText("Imagen capturada: " + uri);
  //   setScanned(true);
  // };
  const handleCameraCapture = ({ type, data }) => {
    setText(data);
    setScanned(true);
    console.log("Type: ", type + " Data: ", data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Favor de permitir el uso de la cámara</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>Sin acceso a la cámara</Text>
        {/* <Button title="Capture" onPress={handleCameraCapture} /> */}
        <Button
          title={"Permitir acceso"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        {hasPermission && (
          <Camera
            style={styles.preview}
            ref={cameraRef}
            ratio="16:9"
            captureMode="still"
            onCapture={scanned ? undefined : handleCameraCapture}
          />
        )}
      </View>
      <Text style={styles.maintext}>{text}</Text>
      {scanned && (
        <Button
          title={"¿Escanear de nuevo?"}
          onPress={() => setScanned(false)}
          color="tomato"
        />
      )}
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
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

import { StyleSheet, Text, Pressable, Image } from "react-native";
import Images from "../Themes/images";
import Colors from "../Themes/colors";
import React from "react";

const SpotifyAuthButton = ({ pressFn }) => {
  return (
    <Pressable style={styles.spotifyButton} onPress={pressFn}>
      <Image
        source={Images.spotify}
        style={{ width: 16, height: 16, marginRight: 8 }}
      />
      <Text style={styles.spotifyButtonText}>CONNECT WITH SPOTIFY</Text>
    </Pressable>
  );
};

export default SpotifyAuthButton;

const styles = StyleSheet.create({
  spotifyButton: {
    backgroundColor: Colors.spotify,
    padding: 10,
    borderRadius: 999999,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  spotifyButtonText: {
    color: "white",
    fontWeight: "700"
  }
});

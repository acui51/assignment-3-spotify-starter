import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Colors from "../Themes/colors";
import millisToMinutesAndSeconds from "../utils/millisToMinuteSeconds";

const Song = ({
  imageUrl,
  songTitle,
  songArtist,
  songIdx,
  duration,
  albumName,
}) => {
  return (
    <View style={styles.song}>
      <Text style={styles.songId}>{songIdx + 1}</Text>
      <Image source={{ uri: imageUrl }} style={styles.songImage} />
      <View style={styles.songNameArtist}>
        <Text style={{ color: "white" }} numberOfLines={1}>
          {songTitle}
        </Text>
        <Text style={{ color: Colors.gray }}>{songArtist}</Text>
      </View>
      <Text numberOfLines={1} style={{ flexBasis: "25%", color: "white" }}>
        {albumName}
      </Text>
      <Text style={{ color: "white" }}>
        {millisToMinutesAndSeconds(duration)}
      </Text>
    </View>
  );
};

export default Song;

const styles = StyleSheet.create({
  songId: {
    marginRight: 16,
    color: Colors.gray,
  },
  songImage: {
    width: 64,
    height: 64,
    resizeMode: "cover",
    marginRight: 16,
  },
  song: {
    marginVertical: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  songNameArtist: {
    display: "flex",
    flexBasis: "30%",
    marginRight: 16,
  },
});

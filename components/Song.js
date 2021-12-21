import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const Song = ({
  imageUrl,
  songTitle,
  songArtist,
  songIdx,
  duration,
  albumName,
}) => {
  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  return (
    <View style={styles.song}>
      <Text style={styles.songId}>{songIdx + 1}</Text>
      <Image source={{ uri: imageUrl }} style={styles.songImage} />
      <View style={styles.songNameArtist}>
        <Text numberOfLines={1}>{songTitle}</Text>
        <Text style={{ color: "gray" }}>{songArtist}</Text>
      </View>
      <Text numberOfLines={1} style={{ flexBasis: "25%" }}>
        {albumName}
      </Text>
      <Text>{millisToMinutesAndSeconds(duration)}</Text>
    </View>
  );
};

export default Song;

const styles = StyleSheet.create({
  songId: {
    marginRight: 16,
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

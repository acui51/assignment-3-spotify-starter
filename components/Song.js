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
  albumName
}) => {
  return (
    <View style={styles.song}>
      {/* Song id portion */}
      <Text style={styles.songId}>{songIdx + 1}</Text>

      {/* Song image portion */}
      <Image source={{ uri: imageUrl }} style={styles.songImage} />

      {/* Stacked artist and title portion */}
      <View style={styles.songNameArtist}>
        <Text style={{ color: "white" }} numberOfLines={1}>
          {songTitle}
        </Text>
        {/* Multiple artists */}
        <Text style={{ color: Colors.gray }} numberOfLines={1}>
          {/* We use a ternary here to conditionally add the comma delimiter in only on non-last index artists */}
          {songArtist.map((artist, idx) =>
            idx !== songArtist.length - 1 ? (
              <Text key={idx}>{artist.name}, </Text>
            ) : (
              <Text key={idx}>{artist.name}</Text>
            )
          )}
        </Text>
      </View>

      {/* Album name portion */}
      <Text numberOfLines={1} style={{ flexBasis: "25%", color: "white" }}>
        {albumName}
      </Text>

      {/* Time */}
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
    color: Colors.gray
  },
  songImage: {
    width: 64,
    height: 64,
    resizeMode: "cover",
    marginRight: 16
  },
  song: {
    marginVertical: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  songNameArtist: {
    display: "flex",
    flexBasis: "30%",
    marginRight: 16
  }
});

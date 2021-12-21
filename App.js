import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import Song from "./components/Song";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const ALBUM_ID = "0FHpjWlnUmplF5ciL84Wpa?si=LW1QU1cdTHOPM74faZse9Q";

export default function App() {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "ce792b478e6143d396d126a60eb46a76",
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
      ],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: "exp://192.168.1.101:19000",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      // Authenticated
      myTopTracks(setTracks, token);
    }
  }, [token]);

  const renderItems = ({ item, index }) => {
    return (
      <Song
        imageUrl={item.album.images[0].url}
        songTitle={item.name}
        songArtist={item.artists[0].name}
        songIdx={index}
        albumName={item.album.name}
        duration={item.duration_ms}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {!token ? (
        <Pressable
          style={styles.spotifyButton}
          onPress={() => {
            promptAsync();
          }}
        >
          <Image
            source={require("./assets/spotify-logo.png")}
            style={{ width: 16, height: 16, marginRight: 8 }}
          />
          <Text style={styles.spotifyButtonText}>CONNECT WITH SPOTIFY</Text>
        </Pressable>
      ) : (
        <FlatList
          data={tracks}
          renderItem={renderItems}
          keyExtractor={(_, id) => `${id}`}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    marginHorizontal: 24,
  },
  spotifyButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 999999,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  spotifyButtonText: {
    color: "white",
    fontWeight: "700",
  },
});

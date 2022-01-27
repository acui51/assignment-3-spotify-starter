import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  FlatList,
  View
} from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import Song from "./components/Song";
import Colors from "./Themes/colors";
import Images from "./Themes/images";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";

// Endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

export default function App() {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
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
      // Authenticated, make API request

      // TODO: Select which option you want: Top Tracks or Album Tracks
      // Comment out the one you are not using
      // myTopTracks(setTracks, token);
      albumTracks(ALBUM_ID, setTracks, token);
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
      {/* We can also use a ternary here because it automatically returns the JSX */}
      {!token ? (
        <Pressable
          style={styles.spotifyButton}
          onPress={() => {
            promptAsync();
          }}
        >
          <Image
            source={Images.spotify}
            style={{ width: 16, height: 16, marginRight: 8 }}
          />
          <Text style={styles.spotifyButtonText}>CONNECT WITH SPOTIFY</Text>
        </Pressable>
      ) : (
        <>
          <View style={styles.titleContainer}>
            <Image
              source={Images.spotify}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            <Text style={styles.spotifyTitle}>My Top Tracks</Text>
          </View>
          <FlatList
            data={tracks}
            renderItem={renderItems}
            keyExtractor={(_, id) => `${id}`}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  spotifyTitle: {
    fontSize: 24,
    color: "white",
    fontWeight: "700"
  },
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

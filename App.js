import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
//  add linter ignore unused-imports for this line
import { myTopTracks, albumTracks, constants } from './utils';
import { Themes } from './assets/Themes';
import { SpotifyAuthButton, SongList } from './components';

//  add linter ignore unused-vars for this line
const { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } = constants;

// Endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function App() {
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    const fetchTracks = async () => {
      const res = await myTopTracks(token);
      // const res = await albumTracks(ALBUM_ID, token);
      setTracks(res);
    };

    if (token) {
      // Authenticated, make API request
      fetchTracks();
    }
  }, [token]);

  let contentDisplayed = null;

  if (token) {
    contentDisplayed = <SongList tracks={tracks} />;
  } else {
    contentDisplayed = <SpotifyAuthButton pressFn={promptAsync} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {contentDisplayed}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Themes.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

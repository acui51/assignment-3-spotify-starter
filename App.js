import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useSpotifyAuth } from './utils';
import { Themes } from './assets/Themes';
import { SpotifyAuthButton, SongList } from './components';

export default function App() {
  // pass in true to fetch only the album tracks
  const [loggedIn, setLoggedIn, tracks] = useSpotifyAuth();

  let contentDisplayed = null;

  if (loggedIn) {
    contentDisplayed = <SongList tracks={tracks} testID={'SongList'} />;
  } else {
    contentDisplayed = <SpotifyAuthButton pressFn={setLoggedIn} />;
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

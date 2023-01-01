import getEnv from "./env";
import { Platform } from "react-native";
import { useState, useEffect } from "react";
import {
  ResponseType,
  useAuthRequest,
  makeRedirectUri,
} from "expo-auth-session";
import { getMyTopTracks, getAlbumTracks } from "./apiOptions";

import * as WebBrowser from "expo-web-browser";

const {
  REDIRECT_URI,
  SCOPES,
  CLIENT_ID,
  ALBUM_ID,
  SPOTIFY_API: { DISCOVERY },
} = getEnv();

// needed so that the browswer closes the modal after auth token
WebBrowser.maybeCompleteAuthSession();

const formatter = (data) => data.map((val) => {
  const artists = val.artists?.map((artist) => ({ name: artist.name }));
  // returning undefined for now to not confuse students, ideally a fix would be a hosted version of this
  return ({
    songTitle: val.name,
    songArtists: artists,
    albumName: val.album?.name,
    imageUrl: val.album?.images[0]?.url ?? undefined,
    duration: val.duration_ms,
    externalUrl: val.external_urls?.spotify ?? undefined,
    previewUrl: val.preview_url ?? undefined,
  });
});

const useSpotifyAuth = (ALBUM_ONLY = false) => {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [_, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri:
        Platform.OS !== "web"
          ? REDIRECT_URI
          : makeRedirectUri({
              // scheme: null, // optional for web, mobile default: 'exp'
              preferLocalhost: true,
              isTripleSlashed: true,
              // useProxy: true, // not needed afaict, default: false
            }),
    },
    DISCOVERY
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
    if (Platform.OS === "web" && location.hash)
      setToken(location.hash.split("=")[1]);
  }, [response]);

  useEffect(() => {
    const fetchTracks = async () => {
      let res;
      switch (ALBUM_ONLY) {
        case true:
          res = await getAlbumTracks(ALBUM_ID, token);
          break;
        default:
          res = await getMyTopTracks(token);
          break;
      }
      setTracks(formatter(res));
    };

    if (token) {
      // Authenticated, make API request
      fetchTracks();
    }
  }, [token]);

  const setLoggedIn = () => {
    promptAsync(
      Platform.OS === "web"
        ? { windowName: "_self" }
        : /* this is for forcing the popup to be created within the same window so needs same context */
          {}
    );
  };
  // TO DO: pick better naming conventions
  return { token: token ?? undefined, tracks, getSpotifyAuth: setLoggedIn };
};

export default useSpotifyAuth;

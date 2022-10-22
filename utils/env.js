import { Platform } from "react-native";

// ***** TODO 1: Fill in your constants here ***** //
const CLIENT_ID = "";
const REDIRECT_URI = "";
const ALBUM_ID = "2nLOHgzXzwFEpl62zAgCEC?si=92gvi84ZTLKfMD-YgYWAUw"; // By default, this is the Weeknd's Album's "DAWN FM"
// ********************************************* //

const redirectUri = (uri) => {
  if (!uri) {
    const err = new Error("No redirect URI provided.\nPlease provide a redirect URI in env.js.\n You can find the file in utils/env.js.");
    console.error(err);
    alert(err);
  }
  return Platform.OS === "web" ? "http://localhost:19006/" : uri;
};

const ENV = {
  CLIENT_ID: "ce792b478e6143d396d126a60eb46a76",
  SCOPES: [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "streaming",
    "user-read-email",
    "user-read-private",
  ],
  // TODO 2: Read the spec and add your own redirect uri
  REDIRECT_URI: redirectUri(/*remove this comment & add your uri here!*/),
  ALBUM_ID: "2nLOHgzXzwFEpl62zAgCEC?si=92gvi84ZTLKfMD-YgYWAUw",
  SPOTIFY_API: {
    // Endpoints for auth & token flow
    DISCOVERY: {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    },
    SHORT_TERM_API:
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term",
    LONG_TERM_API:
      "https://api.spotify.com/v1/me/top/tracks?time_range=long_term",
    ALBUM_TRACK_API_GETTER: (albumId) =>
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
  },
};

const getEnv = () => ENV;
export default getEnv;
// ^ use this type of exporting to ensure compliance with webpack and expo-web

import axios from "axios";

export const myTopTracks = async (token) => {
  try {
    const res = await axios(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    );
    return res.data.items;
  } catch (e) {
    console.error(e);
  }
};

export const albumTracks = async (albumId, token) => {
  try {
    const res = await axios(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    );
    const transformedResponse = res.data.tracks.items.map((item) => {
      item.album = { images: res.data.images, name: res.data.name };
      return item;
    });
    return transformedResponse;
  } catch (e) {
    console.error(e);
  }
};

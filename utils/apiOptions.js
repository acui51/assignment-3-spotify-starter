import axios from 'axios';

const SHORT_TERM_API = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term';
const LONG_TERM_API = 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term';
const ALBUM_TRACK_API_GETTER = (albumId) => `https://api.spotify.com/v1/albums/${albumId}/tracks`;

const fetcher = async (url, token) => {
  try {
    return await axios(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const myTopTracks = async (token) => {
  try {
    let res = await fetcher(SHORT_TERM_API, token);
    if (!res) res = await fetcher(LONG_TERM_API, token);
    return res.data?.items;
  } catch (e) {
    console.error(e);
  }
};

export const albumTracks = async (albumId, token) => {
  try {
    const res = await fetcher(ALBUM_TRACK_API_GETTER(albumId), token);
    const transformedResponse = res.data?.tracks?.items?.map((item) => {
      item.album = { images: res.data?.images, name: res.data?.name };
      return item;
    });
    // TO DO maybe reply with a cached version of an album if spotify api is down or sth
    return transformedResponse;
  } catch (e) {
    console.error(e);
  }
};

const API_URL = `${process.env.API_URL}/api/v1`;

export async function fetchfromApi(endPoint: string) {
  return fetch(API_URL + endPoint)
    .then((res) => (res.ok ? res.json() : res.json().then((err) => Promise.reject(err))));
}

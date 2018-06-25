import Cookie from "js-cookie";
import jwtDecode from "jwt-decode";

const getQueryParams = () => {
  const params = {};
  window.location.href.replace(
    /([^(?|#)=&]+)(=([^&]*))?/g,
    ($0, $1, $2, $3) => {
      params[$1] = $3;
    },
  );
  return params;
};

export const extractInfoFromHash = () => {
  if (!process.browser) {
    return undefined;
  }
  const { id_token, access_token, state } = getQueryParams();
  return { token: id_token, access_token, secret: state };
};

export const setToken = (token, accessToken) => {
  if (!process.browser) {
    return;
  }
  Cookie.set("user", jwtDecode(token));
  Cookie.set("jwt", token);
  Cookie.set("token", accessToken);
};

export const unsetToken = () => {
  if (!process.browser) {
    return;
  }
  Cookie.remove("jwt");
  Cookie.remove("user");
  Cookie.remove("secret");

  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
};

export const getUserFromServerCookie = req => {
  const cookie = getServerCookie(req);
  if (!cookie) {
    return undefined;
  }
  return jwtDecode(cookie);
};

export const getServerCookie = req => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const jwtCookie = req.headers.cookie
    .split(";")
    .find(c => c.trim().startsWith("jwt="));
  if (!jwtCookie) {
    return undefined;
  }
  return jwtCookie.split("=")[1];
};

export const getLocalCookie = () => {
  return Cookie.getJSON("jwt");
};

export const getUserFromLocalCookie = () => {
  return Cookie.getJSON("user");
};

export const setSecret = secret => Cookie.set("secret", secret);

export const checkSecret = secret => Cookie.get("secret") === secret;

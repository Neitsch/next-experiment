import { setSecret } from "./index";

import uuid from "uuid";

const getLock = options => {
  const config = require("./config.json");
  const Auth0Lock = require("auth0-lock").default;
  return new Auth0Lock(
    config.AUTH0_CLIENT_ID,
    config.AUTH0_CLIENT_DOMAIN,
    options,
  );
};

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`;

const getOptions = container => {
  const secret = uuid.v4();
  setSecret(secret);
  return {
    auth: {
      params: {
        scope: "openid",
        state: secret,
      },
      redirectUrl: `${getBaseUrl()}/auth/signed-in`,
      responseType: "token id_token",
    },
    closable: false,
    container,
  };
};

export const show = container => getLock(getOptions(container)).show();
export const logout = () => getLock({}).logout({ returnTo: getBaseUrl() });

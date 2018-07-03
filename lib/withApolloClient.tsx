import withApollo from "next-with-apollo";

import { getLocalCookie, getServerCookie } from "./auth/index";
import initApollo from "./initApollo";

export default withApollo(req => {
  const jwt = !req.headers ? getLocalCookie() : getServerCookie(req);
  const client = initApollo({}, jwt);
  return client;
});

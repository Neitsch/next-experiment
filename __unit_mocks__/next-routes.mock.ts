export const pushRoute = jest.fn();

const Router = jest.fn().mockImplementation(() => ({
  add: Router,
  Link: jest.fn(),
  Router: {
    pushRoute,
  },
}));

export default Router;

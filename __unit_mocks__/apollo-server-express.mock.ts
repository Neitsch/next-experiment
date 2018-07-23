const applyMiddleware = jest.fn();

export const ApolloServer = jest.fn().mockImplementation(() => ({
  applyMiddleware,
}));

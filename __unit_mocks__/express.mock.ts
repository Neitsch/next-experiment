export default jest.fn().mockReturnValue({
  use: jest.fn(),
  listen: jest.fn(),
  get: jest.fn(),
});

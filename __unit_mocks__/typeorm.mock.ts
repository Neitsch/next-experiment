export const Column = jest.fn().mockImplementation(() => target => target);
export const Entity = jest.fn().mockImplementation(() => target => target);
export const Generated = jest.fn().mockImplementation(() => target => target);
export const PrimaryColumn = jest
  .fn()
  .mockImplementation(() => (target, name) => {
    Object.defineProperty(target, name, {
      writable: true,
    });
    return target;
  });

export const createConnection = jest.fn().mockReturnValue({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn(),
  }),
});

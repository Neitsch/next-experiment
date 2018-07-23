import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";

jest.unmock("../Query");

describe("Graphql", () => {
  describe("Query", () => {
    let QueryData: GraphQLObjectTypeConfig<any, any>;
    beforeAll(() => {
      require("../Query");
      // @ts-ignore
      QueryData = GraphQLObjectType.mock.calls[0][0];
    });
    describe("User field", () => {
      it("works", async () => {
        const userObj = {
          username: "Username A",
        };
        const connection = {
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockReturnValue(userObj),
            save: jest.fn().mockImplementation(c => c),
          }),
        };
        // @ts-ignore
        const userRet = await QueryData.fields.user.resolve(null, null, {
          connection,
          userSub: "sub",
        });
        expect(userRet).toEqual(userObj);
      });
      it("creates if not exist", async () => {
        const userObj = {
          username: "Username A",
        };
        const connection = {
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockReturnValue(null),
            save: jest.fn().mockReturnValue(userObj),
          }),
        };
        // @ts-ignore
        const userRet = await QueryData.fields.user.resolve(null, null, {
          connection,
          userSub: "sub",
        });
        expect(userRet).toEqual(userObj);
      });
    });
  });
});

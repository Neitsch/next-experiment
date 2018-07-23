import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import Joi from "joi";

jest.unmock("../Mutation");

describe("Graphql", () => {
  describe("Mutation", () => {
    let MutationData: GraphQLObjectTypeConfig<any, any>;
    beforeAll(() => {
      require("../Mutation");
      // @ts-ignore
      MutationData = GraphQLObjectType.mock.calls[0][0];
    });
    describe("Change Username", () => {
      it("works", async () => {
        const connection = {
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockReturnValue({
              username: "Username A",
            }),
            save: jest.fn().mockImplementation(c => c),
          }),
        };
        // @ts-ignore
        const user = await MutationData.fields.changeUsername.resolve(
          null,
          {
            username: "Test Username",
          },
          { userSub: "Some sub", connection },
        );
        expect(user.username).toEqual("Test Username");
      });
      it("throws without user", async () => {
        const connection = {
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockReturnValue(null),
            save: jest.fn().mockImplementation(c => c),
          }),
        };
        expect(
          // @ts-ignore
          MutationData.fields.changeUsername.resolve(
            null,
            {
              username: "Test Username",
            },
            { userSub: "Some sub", connection },
          ),
        ).rejects.toBeDefined();
      });
      it("validates and returns error", async () => {
        Joi.validate.mockReturnValue({
          error: {
            details: ["Test Message"],
          },
        });
        expect(
          // @ts-ignore
          MutationData.fields.changeUsername.resolve(
            null,
            {
              username: "Test Username",
            },
            { userSub: null, connection: null },
          ),
        ).rejects.toBeDefined();
      });
    });
  });
});

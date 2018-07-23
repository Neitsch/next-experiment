import { shallow } from "enzyme";
import gql from "graphql-tag";
import React from "react";

import ChangeUsername from "../ChangeUsername";

jest.unmock("../ChangeUsername");
jest.unmock("../../dumb/TextFieldWithEnterToSubmit");
jest.mock("graphql-tag", () =>
  jest.fn().mockImplementation(a => ({
    data: a,
  })),
);

describe("ChangeUsername", () => {
  describe("renders", () => {
    it("base", () => {
      const rendered = shallow(<ChangeUsername />);
      expect(rendered).toMatchSnapshot();
    });
    it("mutation", () => {
      const changeUsername = jest.fn();
      const baseRendered = shallow(<ChangeUsername />);
      const mutationRendered = baseRendered.props().children(changeUsername);
      expect(mutationRendered).toMatchSnapshot();
    });
    it("submit setup", () => {
      const changeUsername = jest.fn();
      const baseRendered = shallow(<ChangeUsername />);
      const mutationRendered = baseRendered.props().children(changeUsername);
      mutationRendered.props.onSubmit("Test");
      expect(changeUsername).toHaveBeenLastCalledWith({
        variables: { username: "Test" },
      });
    });
  });
});

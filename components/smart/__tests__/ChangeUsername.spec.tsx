import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";

import ChangeUsername from "../ChangeUsername";

jest.unmock("../ChangeUsername");
jest.unmock("../../dumb/TextFieldWithEnterToSubmit");

describe("ChangeUsername", () => {
  describe("renders", () => {
    it("base", () => {
      const rendered = shallow(<ChangeUsername />);
      expect(rendered).toMatchSnapshot();
    });
    it("mutation", () => {
      const changeUsername = jest.fn();
      const baseRendered = shallow(<ChangeUsername />);
      const mutationRendered = baseRendered
        .props()
        .children(changeUsername, {});
      expect(mutationRendered).toMatchSnapshot();
    });
    it("submit setup", () => {
      const changeUsername = jest.fn();
      const baseRendered = shallow(<ChangeUsername />);
      const mutationRendered = shallow(
        baseRendered.props().children(changeUsername, {}),
      ).find("#change-username-field");
      mutationRendered.props().onSubmit("Test");
      expect(changeUsername).toHaveBeenLastCalledWith({
        variables: { username: "Test" },
      });
    });
    it("Error display", () => {
      const changeUsername = jest.fn();
      const baseRendered = shallow(<ChangeUsername />);
      const mutationRendered = shallow(
        baseRendered.props().children(changeUsername, {
          error: {
            graphQLErrors: [
              { extensions: { exception: { details: ["Test Details"] } } },
            ],
          },
        }),
      );
      expect(mutationRendered).toMatchSnapshot();
    });
  });
});

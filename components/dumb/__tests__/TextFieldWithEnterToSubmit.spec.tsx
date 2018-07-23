import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";

import TextFieldWithEnter from "../TextFieldWithEnterToSubmit";

jest.unmock("../TextFieldWithEnterToSubmit");

describe("TextFieldWithEnterToSubmit", () => {
  it("renders", () => {
    expect(
      shallow(<TextFieldWithEnter onSubmit={jest.fn()} />),
    ).toMatchSnapshot();
  });
  it("forwards props to textfield", () => {
    const fn = jest.fn();
    expect(toJson(shallow(<TextFieldWithEnter onSubmit={fn} />))).not.toEqual(
      toJson(
        shallow(
          <TextFieldWithEnter
            onSubmit={fn}
            textFieldProps={{ additionalProps: "prop data" }}
          />,
        ),
      ),
    );
  });
  it("Changed textcontent", () => {
    const TextFieldRender = shallow(
      <TextFieldWithEnter onSubmit={jest.fn()} />,
    );
    TextFieldRender.setState({ textcontent: "Test" });
    expect(TextFieldRender.props().value).toEqual("Test");
  });
  it("On Change", () => {
    const TextFieldRender = shallow(
      <TextFieldWithEnter onSubmit={jest.fn()} />,
    );
    TextFieldRender.props().onChange({
      currentTarget: { value: "Test Value" },
      preventDefault: jest.fn(),
    });
    expect(TextFieldRender.state("textcontent")).toEqual("Test Value");
  });
  describe("On Key Press", () => {
    it("Not enter pressed", () => {
      const onSubmit = jest.fn();
      const TextFieldRender = shallow(
        <TextFieldWithEnter onSubmit={onSubmit} />,
      );
      TextFieldRender.setState({ textcontent: "Test" });
      TextFieldRender.props().onKeyPress({ charCode: 97 });
      expect(onSubmit).not.toHaveBeenCalled();
      expect(TextFieldRender.state("textcontent")).toEqual("Test");
    });
    it("Enter pressed", () => {
      const onSubmit = jest.fn();
      const TextFieldRender = shallow(
        <TextFieldWithEnter onSubmit={onSubmit} />,
      );
      TextFieldRender.setState({ textcontent: "Test" });
      TextFieldRender.props().onKeyPress({
        charCode: 13,
        preventDefault: jest.fn(),
      });
      expect(onSubmit).toHaveBeenCalledWith("Test");
      expect(TextFieldRender.state("textcontent")).toEqual("Test");
    });
    it("Enter pressed - clear", () => {
      const onSubmit = jest.fn();
      const TextFieldRender = shallow(
        <TextFieldWithEnter onSubmit={onSubmit} doClear />,
      );
      TextFieldRender.setState({ textcontent: "Test" });
      TextFieldRender.props().onKeyPress({
        charCode: 13,
        preventDefault: jest.fn(),
      });
      expect(onSubmit).toHaveBeenCalledWith("Test");
      expect(TextFieldRender.state("textcontent")).toEqual("");
    });
  });
});

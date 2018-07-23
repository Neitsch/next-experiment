import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";

interface IProps {
  onSubmit: (textcontent: string) => void;
  doClear: boolean;
  textFieldProps?: TextFieldProps;
}

type Props = IProps;

interface IState {
  textcontent: string;
}

class TextFieldWithEnterToSubmit extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      textcontent: "",
    };
  }
  public render() {
    return (
      <TextField
        value={this.state.textcontent}
        onChange={this.usernameChange}
        onKeyPress={this.onKeyPress}
        {...this.props.textFieldProps}
      />
    );
  }
  private onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.charCode !== 13) {
      return;
    }
    e.preventDefault();
    this.props.onSubmit(this.state.textcontent);
    if (this.props.doClear) {
      this.setState(() => ({
        textcontent: "",
      }));
    }
  };
  private usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const textcontent = e.currentTarget.value;
    this.setState(() => ({
      textcontent,
    }));
  };
}

export default TextFieldWithEnterToSubmit;

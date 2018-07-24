const joi = {
  string: jest.fn().mockImplementation(() => joi),
  alphanum: jest.fn().mockImplementation(() => joi),
  min: jest.fn().mockImplementation(() => joi),
  max: jest.fn().mockImplementation(() => joi),
  label: jest.fn().mockImplementation(() => joi),
  required: jest.fn().mockImplementation(() => joi),
  validate: jest.fn().mockReturnValue({}),
};

export default joi;

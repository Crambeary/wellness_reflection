import renderer from "react-test-renderer";
import FormInput from "./FormInput";

describe('FormInput', () => {
  it("renders correctly", () => {
    const mockOnChange = jest.fn();
    const component = renderer.create(
      <FormInput
        label="Test Label"
        id="test-id"
        value="Test Value"
        onChange={mockOnChange}
        fieldType="input"
        disabled={false}
      />,
    );
    
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

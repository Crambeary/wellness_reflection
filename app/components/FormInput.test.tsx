import FormInput from "./FormInput";
import { render } from "@testing-library/react";

describe("FormInput", () => {
  it("should render the FormInput component as an input", () => {
    const { container } = render(
      <FormInput
        label="Test"
        id="test"
        type="text"
        fieldType="input"
        value="test"
        onChange={() => {}}
      />,
    );
    const inputElement = container.querySelector("input");
    if (!inputElement) {
      throw new Error("Input element not found");
    }
    expect(inputElement.value).toContain("test");
  });
  it("should render the FormInput component as a textarea", () => {
    const { container } = render(
      <FormInput
        label="Test"
        id="test"
        type="text"
        fieldType="textarea"
        value="test"
        onChange={() => {}}
      />,
    );
    const textareaElement = container.querySelector("div");
    if (!textareaElement) {
      throw new Error("Textarea element not found");
    }
    expect(textareaElement.textContent).toContain("test");
  });
  it("shows the clear button when the type is time", () => {
    const { container } = render(
      <FormInput
        label="Test"
        id="test"
        type="time"
        fieldType="input"
        value="test"
        onChange={() => {}}
      />,
    );
    const inputElement = container.querySelector("input");
    if (!inputElement) {
      throw new Error("Input element not found");
    }
    expect(inputElement.type).toBe("time");
    expect(
      (container.children[0].children[2] as HTMLButtonElement).tagName,
    ).toBe("BUTTON");
  });
});

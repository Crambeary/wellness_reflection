import { render, screen, fireEvent } from '@testing-library/react';
import FormInput from './FormInput';

describe('FormInput', () => {
  it('renders and handles user input', () => {
    const handleChange = jest.fn();
    render(
      <FormInput
        label="Test Label"
        id="test-id"
        value="Initial Value"
        onChange={handleChange}
        fieldType="input"
      />
    );

    const input = screen.getByLabelText('Test Label');
    expect(input).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalled();
  });
});

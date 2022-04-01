import { useState } from 'react';

/*
 * Custom hook for form fields
 * https://github.com/fgerschau/react-custom-form-validation-example/blob/master/src/useForm.ts
 */

/* Example usage:
  const {
    handleSubmit, // handles form submission
    handleChange, // handles input changes
    data, // access to the form data
    errors, // includes the errors to show
  } = useForm({
    validations: { // validation rules
      name: {
        pattern: {
          value: '^[A-Za-z]*$',
          message: 'Invalid name'
        },
      },
    },
    onSubmit: () => alert('User submitted!'),
    initialValues: { // used to initialize the data
      name: 'John',
    },
  });

  // ...
  return (
    <form onSubmit={handleSubmit}>
      <input value={data.name || ''} onChange={handleChange('name')} required />
      {errors.name && <p className="error">{errors.name}</p>}
      </form>
  );
*/
export const useForm = (options) => {
  const [data, setData] = useState(options?.initialValues || {});
  const [errors, setErrors] = useState({});

  const handleChange = (key, sanitizeFn) => (
    e,
  ) => {
    const value = sanitizeFn ? sanitizeFn(e.target.value) : e.target.value;
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validations = options?.validations;
    if (validations) {
      let valid = true;
      const newErrors = {};
      for (const key in validations) {
        const value = data[key];
        const validation = validations[key];
        if (validation?.required?.value && !value) {
          valid = false;
          newErrors[key] = validation?.required?.message;
        }

        const pattern = validation?.pattern;
        if (pattern?.value && !RegExp(pattern.value).test(value)) {
          valid = false;
          newErrors[key] = pattern.message;
        }

        const custom = validation?.custom;
        if (custom?.isValid && !custom.isValid(value)) {
          valid = false;
          newErrors[key] = custom.message;
        }
      }

      if (!valid) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});

    if (options?.onSubmit) {
      options.onSubmit();
    }
  };

  return {
    data,
    handleChange,
    handleSubmit,
    errors,
  };
};

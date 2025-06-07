import { useState, useCallback } from 'react';
import * as Yup from 'yup';

interface FormErrors {
  [key: string]: string;
}

interface UseFormProps<T> {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: T) => Promise<void>;
}

export const useForm = <T extends object>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is modified
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  }, []);

  const validateField = useCallback(
    async (name: keyof T, value: any) => {
      try {
        await validationSchema.validateAt(name as string, { [name]: value });
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
        return true;
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setErrors((prev) => ({
            ...prev,
            [name]: error.message,
          }));
        }
        return false;
      }
    },
    [validationSchema],
  );

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await validationSchema.validate(values, { abortEarly: false });
      await onSubmit(values);
      setErrors({});
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField,
    reset,
  };
};

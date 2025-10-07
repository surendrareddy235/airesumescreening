import { createContext, useContext, useId, forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { clsx } from "clsx";

const Form = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

const FormFieldContext = createContext({});
const FormItemContext = createContext({});

const FormField = ({ name, control, ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} control={control} {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  
  // Handle case where form context is not available
  let fieldState = {};
  try {
    const formContext = useFormContext();
    if (formContext && formContext.getFieldState && fieldContext?.name) {
      fieldState = formContext.getFieldState(fieldContext.name, formContext.formState);
    }
  } catch (error) {
    // Form context not available, use default state
    fieldState = {};
  }

  if (!fieldContext) {
    // Return default values if not in a form context
    return {
      id: itemContext?.id || "default",
      name: "default",
      formItemId: `default-form-item`,
      formDescriptionId: `default-form-item-description`,
      formMessageId: `default-form-item-message`,
      ...fieldState,
    };
  }

  const { id } = itemContext || { id: "default" };

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItem = forwardRef(({ className, ...props }, ref) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={clsx("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = forwardRef(({ className, ...props }, ref) => {
  const { formItemId } = useFormField();

  return (
    <label
      ref={ref}
      className={clsx("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <div
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={clsx("text-sm text-slate-500", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={clsx("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
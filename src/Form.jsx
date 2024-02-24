import { useEffect, useState } from "react";
import { response } from "./api";
import { FieldCheckbox, FieldRadio, FieldText } from "./Fieldset";
import { z } from "zod";
import { getUrl } from "./utils";
import { updateUrl } from "./utils";

// https://stackoverflow.com/questions/77131197/how-do-i-change-zods-array-custom-error

/**
 * e.g. formKey base | flavor | toppings
 */
function getType(formKey) {
  const isMultiple = ["multiple", "checkbox"];
  return isMultiple.includes(response[formKey].type) ? "multiple" : "single";
}

function buildValidation(schema) {
  const zObj = {};
  Object.keys(schema).forEach((key) => {
    const type = schema[key].type;
    let validation = null;
    if (getType(type) === "multiple") {
      validation = z.array();
    }
    // base radio not string but enum z.enum(['cone', 'cup'])
    if (schema[key].min) {
      validation.min(schema[key].min);
    }
    zObj[key] = validation;
  });
  return z.object(zObj);
}

const validation = z.object({
  base: z.string({
    required_error: "Base is required!",
  }),
  flavor: z
    .array(z.string(), {
      required_error: "array?",
      invalid_type_error: "array!",
    })
    .min(1, {
      message: "You need to pick at least 1 flavor!",
    })
    .max(3, {
      message: "You can pick a max of 3 flavors!",
    }),
  toppings: z
    .array(
      z
        .string()
        .min(1, {
          message: "You need to enter a topping",
        })
        .refine((str) => str !== "poop", {
          message: "Seriously? Pick something else!",
        }),
      {
        required_error: "You need to enter a topping!",
      }
    )
    .min(1),
});

export function Form() {
  const [formValues, setFormValues] = useState(
    Object.keys(response).reduce(
      (obj, curr) => ({
        ...obj,
        [curr]: undefined,
      }),
      {}
    )
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    // type key checking if it's a radio, checkbox, etc.
    for (const [key, value] of url.entries()) {
      // TODO: problem, if I check a flavor and refresh then I have a string, I uncheck
      // and the app breaks
      const type = getType(key);
      setFormValues((prev) => ({
        ...prev,
        [key]:
          prev[key] && prev[key] !== value
            ? [
                ...new Set(
                  [
                    Array.isArray(prev[key]) ? [...prev[key]] : prev[key],
                    value,
                  ].flat()
                ),
              ]
            : type === "multiple"
            ? [value]
            : value,
      }));
    }
  }, []);

  console.log("form:", formValues);

  const handleChange = {
    radio: (e) => {
      const url = getUrl();
      url.set(e.target.name, e.target.value);
      updateUrl(url);
      setFormValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    checkbox: (e) => {
      const url = getUrl();
      const { name, value } = e.target;
      if (e.target.checked) {
        url.append(e.currentTarget.name, e.currentTarget.value);
        setFormValues((prev) => ({
          ...prev,
          [name]: Array.isArray(prev[name]) ? [...prev[name], value] : [value],
        }));
      } else {
        url.delete(name, value);
        setFormValues((prev) => ({
          ...prev,
          [name]: prev[name].filter((val) => val !== value),
        }));
      }
      updateUrl(url);
    },
    multiple: (e, idx) => {
      const { name, value } = e.target;
      setFormValues((prev) => {
        // TODO: how to get rid of these Array.isArray things
        const toppings = Array.isArray(prev[name])
          ? prev[name].slice(0)
          : [prev[name] ?? ""];
        toppings[idx] = value;
        return {
          ...prev,
          toppings,
        };
      });
    },
  };

  const handleBlur = {
    multiple: (e, idx) => {
      const { name, value } = e.target;
      const formValue = Array.isArray(formValues[name])
        ? formValues[name]
        : [formValues[name]];
      const isLastField = formValue?.length === idx;
      if (isLastField && value) {
        setFormValues((prev) => {
          return {
            ...prev,
            [name]: [...formValue, ""],
          };
        });
      }
      const url = getUrl();
      url.delete(name);
      formValue.forEach((item) => {
        if (item) {
          url.append(name, item);
        }
      });
      updateUrl(url);
    },
  };

  // console.log(formValues);

  const handleSubmit = (e) => {
    // NOTE: validations (probably should be done onBlur)
    e.preventDefault();
    // TODO: errors?
    const result = validation.safeParse(formValues);
    console.log("result:", result);
    if (result.error) {
      const { error } = result;
      console.log("error:", error);
      setErrors(() => ({
        ...error.issues.reduce(
          (allErr, curr) => ({
            ...allErr,
            [curr.path[0]]: curr.message,
          }),
          {}
        ),
      }));
    }
  };

  // base required
  // flavor <= 2
  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(response).map(([key, entry]) => {
        return fieldMap[entry.type]({
          key,
          entry,
          formValues,
          handleChange: handleChange[entry.type],
          handleBlur: handleBlur[entry.type],
          // TODO: what if there are more than 1?
          //      isn't a bit overwhelming if I show more?
          //      is bad UX if I hide all and just show 1?
          //      (this is probably why this should happen on blur)
          error: errors[key],
        });
      })}
      <button type="submit">Share with a friend</button>
    </form>
  );
}

const fieldMap = {
  radio: ({ key, entry, formValues, handleChange, error }) => {
    const { label, options, description } = entry;
    return (
      <fieldset key={key}>
        <legend>{label}</legend>
        {description && <div style={{ marginBottom: 10 }}>{description}</div>}
        {options?.map((option) => {
          return (
            <FieldRadio
              key={option.label}
              onChange={handleChange}
              name={key}
              value={option.value}
              label={option.label}
              checked={formValues[key] === option.value}
            />
          );
        })}
        {error && (
          <p className="error" id="error">
            {error}
          </p>
        )}
      </fieldset>
    );
  },
  checkbox: ({ key, entry, formValues, handleChange, error }) => {
    const { type, label, options, description } = entry;
    return (
      <fieldset key={key}>
        <legend>{label}</legend>
        {description && <div style={{ marginBottom: 10 }}>{description}</div>}
        {options?.map((option) => {
          return (
            <FieldCheckbox
              key={option.label}
              onChange={handleChange}
              checked={
                Array.isArray(formValues[key])
                  ? formValues[key].includes(option.value)
                  : formValues[key] === option.value
              }
              name={key}
              value={option.value}
              label={option.label}
              error={error}
            />
          );
        })}
        {error && (
          <p className="error" id="error">
            {error}
          </p>
        )}
      </fieldset>
    );
  },
  // TODO: handle Text, and reuse it in the map
  multiple: ({ key, entry, formValues, handleChange, handleBlur, error }) => {
    const { items } = entry;
    return (
      <fieldset key={key}>
        {Object.keys(items ?? {}).map(([itemKey, itemValue]) => {
          // is this necessary since is multiple?
          const formValue = Array.isArray(formValues[key])
            ? formValues[key]
            : [formValues[key]];
          const hasEmpty = formValue.some(
            (val) => val === "" || val === undefined
          );
          // TODO: handle w recursion
          return (hasEmpty ? formValue : [...formValue, ""]).map(
            (value, idx) => (
              <FieldText
                key={idx}
                name={key}
                type={itemValue.type}
                onBlur={(e) => handleBlur(e, idx)}
                id={itemKey}
                label={`Topping #${idx + 1}`}
                value={value ?? ""}
                onChange={(e) => handleChange(e, idx)}
              />
            )
          );
        })}
        {error && (
          <p className="error" id="error">
            {error}
          </p>
        )}
      </fieldset>
    );
  },
};

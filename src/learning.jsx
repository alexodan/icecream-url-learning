import { Pill } from "./inputs/Pills";
import { RangeInput } from "./inputs/RangeInput";
import { TextInput } from "./inputs/TextInput";

export const formConfig = {
  range: {
    display: function ({ value, id }) {
      const { min, max } = value;
      return <Pill key={id} value={`${min} - ${max}`} />;
    },
    component: (props) => <RangeInput {...props} />,
  },
  number: {
    display: function ({ value, id }) {
      const { min, max } = value;
      return <Pill key={id} value={Number(value)} />;
    },
    component: (props) => <TextInput {...props} />,
  },
  boolean: {
    display: function ({ value, id }) {
      const { min, max } = value;
      return <Pill key={id} value={value ? "Yes" : "No"} />;
    },
    component: function () {},
  },
};

export const formFields = {
  total_attendees: {
    displayType: "multiple",
    type: "range",
    label: "Total attendees",
  },
  square_footage: {
    displayType: "multiple",
    label: "Square footage",
    type: "range",
  },
  year: {
    displayType: "multiple",
    type: "number",
    label: "Year",
  },
  month: {
    displayType: "multiple",
    type: "number",
    label: "Month",
    visibleCondition: (formValues) => {
      return false;
    },
  },
  day: {
    displayType: "multiple",
    type: "number",
    label: "Day",
  },
  // date_range: {
  // displayType: "single",
  //   type: "range",
  //   label: "Date range",
  // },
  // relative_date: {
  // displayType: "single",
  //   type: "number",
  //   label: "Relative date",
  // },
};

export const displayConfig = {
  multiple: function (displayFn, values) {
    // TODO: change to use Pills component
    return values.map((val, i) => {
      return <div key={i}>{displayFn({ value: val })}</div>;
    });
  },
  single: function (displayFn, value) {
    return displayFn({ value });
  },
};

export function renderInputField({ name, label, path, handleAdd }) {
  return formConfig[formFields[name].type].component({
    name,
    label,
    path,
    handleAdd,
  });
}

export function renderPills({ name, value }) {
  const formFieldType = formFields[name].type;
  const displayFn = formConfig[formFieldType].display;
  if (!value) {
    return null;
  }
  return displayConfig[formFields[name].displayType](displayFn, value);
}

import { Pill } from "./inputs/Pills";
import { RangeInput } from "./inputs/RangeInput";
import { TextInput } from "./inputs/TextInput";

export const formConfig = {
  range: {
    display: function ({ value }) {
      if (!value) return "";
      const { min, max } = value;
      return <Pill value={`${min} - ${max}`} />;
    },
    component: (props) => <RangeInput {...props} />,
  },
  number: {
    display: function ({ value }) {
      if (!value) return "";
      return Number(value);
    },
    component: (props) => <TextInput {...props} />,
  },
  boolean: {
    display: function ({ value = false }) {
      return value ? "Yes" : "No";
    },
    component: function () {},
  },
  array: {
    display: function ({ value }) {
      return value.map((val) => {
        // TODO: this would only work one level deep
        // return <ul>{formConfig[formFields[key].fields.type].display(val)}</ul>;
        return null;
      });
    },
    component: function () {},
  },
};

export const formFields = {
  // total_attendees: {
  //   type: "array",
  //   label: "Total attendees",
  //   fields: {
  //     type: "range",
  //   },
  // },
  total_attendees: {
    type: "range",
    label: "Total attendees",
    displayType: "array",
  },
  age: {
    type: "number",
    label: "Age",
  },
  // square_footage: {
  //   type: "array",
  //   label: "Square footage",
  //   fields: {
  //     type: "range",
  //   },
  // },
  // year: {
  //   type: "number",
  //   label: "Year",
  // },
  // month: {
  //   type: "number",
  //   label: "Month",
  //   visibleCondition: (formValues) => {
  //     return false;
  //   },
  // },
  // day: {
  //   type: "number",
  //   label: "Day",
  // },
  // date_range: {
  //   type: "range",
  //   label: "Date range",
  // },
  // relative_date: {
  //   type: "number",
  //   label: "Relative date",
  // },
};

// export function renderField(fields, values) {
//   return Object.entries(values).map(([key, value]) => {
//     return formConfig[fields[key].type].display(value, key, formFields);
//   });
// }

export function renderInputField({ name, label, path, handleAdd, formValues }) {
  console.log("filterName:::", name, formFields[name].type);
  return formConfig[formFields[name].type].component({
    name,
    label,
    path,
    handleAdd,
  });
}

export function renderPills({ name, value }) {
  return formConfig[formFields[name].type].display({
    value,
  });
}

import { Pill } from "./inputs/Pills";
import { RangeInput } from "./inputs/RangeInput";

export const formConfig = {
  range: {
    /* TODO: setFormValues: function (formValues) {} */
    display: function (value) {
      if (!value) return "";
      const { min, max } = value;
      return <Pill value={`${min} - ${max}`} />;
    },
    component: (props) => <RangeInput {...props} />,
  },
  number: {
    display: function (value) {
      if (!value) return "";
      return Number(value);
    },
    component: (props) => (
      <TextInput
        path={props.path}
        name={props.name}
        label={props.label}
        handleAdd={props.handleAdd}
        formValues={props.formValues}
      />
    ),
  },
  boolean: {
    display: function (value = false) {
      return value ? "Yes" : "No";
    },
    component: function () {},
  },
  array: {
    display: function (values, key, formFields) {
      return values.map((val) => {
        // TODO: only works one level deep?
        return <ul>{formConfig[formFields[key].fields.type].display(val)}</ul>;
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

export function renderField(values, filterName) {
  const filterValues = values[filterName];
  console.log("filterName:::", filterName);
  return formConfig[formFields[filterName].type].component(
    {
      path: filterName,
      name: filterName,
      label: formFields[filterName].label,
      handleAdd: null,
    }
    // filterValues,
    // filterName,
    // formFields
  );
}

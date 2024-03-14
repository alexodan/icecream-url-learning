import { useState } from "react";
import { formFields, renderInputField, renderPills } from "./learning";
import { get as _get, set as _set } from "lodash";
import "./Form2.css";
import { Pills } from "./inputs/Pills";

export function Form2() {
  const filters = [
    { name: "year", path: "occurrence.year" },
    { name: "month", path: "occurrence.month" },
    { name: "day", path: "occurrence.day" },
    { name: "date_range", path: "occurrence.date_range" },
    { name: "relative_date", path: "occurrence.relative_date" },
    { name: "total_attendees", path: "total_attendees" },
    { name: "square_footage", path: "square_footage" },
  ];
  const [formValues, setFormValues] = useState({
    total_attendees: [
      {
        min: 1,
        max: 10,
      },
    ],
    square_footage: [],
    occurrence: {
      year: [],
      month: [],
      day: [],
      date_range: [],
      relative_date: null, // '7 days' | '30 days' | '90 days'
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const handleAdd = (path, value) => {
    // TODO: check if path is an array, object, or otherwise
    const newValues = _set(formValues, path, [
      ..._get(formValues, path),
      value,
    ]);
    setFormValues({
      ...newValues,
    });
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Filters</h2>
        <ul className="sidebar-filters">
          {Object.keys(formFields).map((fieldKey) => {
            if (!formValues[fieldKey] || formValues[fieldKey].length === 0) {
              return null;
            }
            return (
              <li key={fieldKey}>
                {formFields[fieldKey].label}:
                <Pills values={formValues[fieldKey]} />
              </li>
            );
          })}
        </ul>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        {Object.keys(formFields).map((key) => {
          if (
            formFields[key].visibleCondition &&
            !formFields[key].visibleCondition(formValues)
          ) {
            return null;
          }
          return (
            <div key={key} className="form-group">
              {renderInputField({
                name: key,
                label: formFields[key].label,
                path: key,
                handleAdd: handleAdd,
                formValues,
              })}
              <div className="pills-container">
                {renderPills({
                  name: key,
                  value: formValues[key],
                })}
              </div>
            </div>
          );
        })}
      </form>
      <pre>{JSON.stringify(formValues, null, 2)}</pre>
    </div>
  );
}

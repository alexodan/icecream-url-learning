import { formConfig, formFields } from "../learning";
import "./pills.css";

export function Pills({ filterName, values = [] }) {
  return (
    <ul className="pills">
      {values.map((filterValue, i) => (
        <Pill
          key={i}
          // value={formConfig[formFields[filterName].type].display(filterValue)}
          value={""}
        />
      ))}
    </ul>
  );
}

export function Pill({ value }) {
  return <li className="pill">{value}</li>;
}

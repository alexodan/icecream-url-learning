import { useState } from "react";
import { Pills } from "./Pills";

// TODO: TextInput gets the path? shame shame i know your name(?)
export function TextInput({ path, name, label, handleAdd, formValues }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const add = () => {
    handleAdd(path, value);
    setValue("");
  };

  return (
    <div>
      <label>{label}</label>
      <input name={name} type="text" value={value} onChange={handleChange} />
      <button onClick={add}>+</button>
      <div className="container">
        <Pills filterName={name} values={formValues[name]} />
      </div>
    </div>
  );
}

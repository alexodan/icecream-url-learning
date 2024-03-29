import { useState } from "react";

export function RangeInput({ name, label, handleAdd }) {
  const [value, setValue] = useState({ min: "", max: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const add = () => {
    handleAdd(name, value);
    setValue({ min: "", max: "" });
  };

  return (
    <div>
      <label>{label}</label>
      <input type="text" name="min" value={value.min} onChange={handleChange} />
      <input type="text" name="max" value={value.max} onChange={handleChange} />
      <button onClick={add}>+</button>
    </div>
  );
}

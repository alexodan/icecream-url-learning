import { useEffect, useState } from "react";
import "./reset.css";
import "./styles.css";
import { Form } from "./Form";
import { Form2 } from "./Form2";
// TODO:
// clean up!

// Capture form values and get a share link with url params
export default function App() {
  const [formValues, setFormValues] = useState({
    base: undefined,
    flavor: undefined,
    toppings: undefined,
  });

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    // type key checking if it's a radio, checkbox, etc.
    // great fit for zod
    for (const [key, value] of url.entries()) {
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
            : value,
      }));
    }
  }, []);

  console.log(formValues);

  const handleRadioChange = (e) => {
    const currentSearch = window.location.search;
    const url = new URLSearchParams(currentSearch);
    url.set(e.target.name, e.target.value);
    window.history.pushState(null, null, `?${url.toString()}`);
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const currentSearch = window.location.search;
    const url = new URLSearchParams(currentSearch);
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
    window.history.pushState(null, null, `?${url.toString()}`);
  };

  return (
    <div className="App">
      {/* <h1>Icecream order from API</h1> */}
      {/* <Form /> */}
      <Form2 />
      {/*
        - TODO 2/3: Update the URL with the icecream fields.
        - TODO 2/3: On mount, prefill the fields based on the URL. */}
    </div>
  );
}

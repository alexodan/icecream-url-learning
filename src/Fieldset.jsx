export function FieldText({ name, value, id, label, onBlur, ...rest }) {
  return (
    <label id={id}>
      <div>{label}</div>
      <input type="text" name={name} value={value} onBlur={onBlur} {...rest} />
    </label>
  );
}

export function FieldCheckbox({ name, value, label, ...rest }) {
  return (
    <label>
      <input type="checkbox" name={name} value={value} {...rest} />
      <span htmlFor={name}>{label}</span>
    </label>
  );
}

export function FieldRadio({ name, value, label, ...rest }) {
  return (
    <label>
      <input type="radio" name={name} value={value} {...rest} />
      <span htmlFor={name}>{label}</span>
    </label>
  );
}

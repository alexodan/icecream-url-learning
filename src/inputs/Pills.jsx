import "./pills.css";

export function Pills({ values = [] }) {
  return (
    <ul className="pills">
      {values.map((filterValue, i) => (
        <Pill key={i} value={filterValue} />
      ))}
    </ul>
  );
}

export function Pill({ value }) {
  return <li className="pill">{JSON.stringify(value, null, 2)}</li>;
}

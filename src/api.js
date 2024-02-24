// forms/schema/icecream-share
export const response = {
  base: {
    type: "radio",
    label: "Base",
    options: [
      { value: "cone", label: "Cone" },
      { value: "cup", label: "Cup" },
    ],
    required: true,
  },
  flavor: {
    type: "checkbox",
    label: "Flavor",
    options: [
      { value: "choco", label: "Choco" },
      { value: "vanilla", label: "Vanilla" },
      { value: "dulce-de-leche", label: "Dulce de leche" },
      { value: "cup", label: "Cup" },
    ],
    required: true,
    maximum: 3,
  },
  toppings: {
    type: "multiple",
    label: "Toppings",
    description: "You can add multiple toppings",
    items: {
      flavor: {
        type: "string",
        label: "Flavor",
      },
      // amount: {
      //   type: "number",
      //   label: "Amount",
      // },
    },
  },
};

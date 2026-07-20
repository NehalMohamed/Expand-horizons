// Module overview: navigate feature logic and route-level wiring.
let navigator;

// Helper for set navigator.
export const setNavigator = (nav) => {
  navigator = nav;
};

// Helper for navigate.
export const navigate = (to) => {
  if (navigator) navigator(to);
};

export const randomNumBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const hypotenuse = (x, y) => {
  return Math.sqrt(x ** 2 + y ** 2);
};

export const hypotenuse = (x, y) => {
  return Math.sqrt(x ** 2 + y ** 2);
};

export const randomNumBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

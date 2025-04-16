module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        4: "repeat(4, minmax(0, 1fr))",
      },
      gridTemplateRows: {
        3: "repeat(3, minmax(0, 1fr))",
      },
    },
  },
  extend: {
    scale: {
      101: '1.01',
      105: '1.05',
      110: '1.10',
    },
  }
  
};

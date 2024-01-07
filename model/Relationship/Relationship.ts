const _Relationship = [
  {
    Name: "Bạn",
  },
  {
    Name: "Anh",
  },
  {
    Name: "Chị",
  },
  {
    Name: "Em",
  },
  {
    Name: "Cô",
  },
  {
    Name: "Dì",
  },
  {
    Name: "Chú",
  },
  {
    Name: "Bác",
  },
  {
    Name: "Cậu",
  },
  {
    Name: "Mợ",
  },
  {
    Name: "Ông",
  },
  {
    Name: "Bà",
  },
  {
    Name: "Cháu",
  },
];

export const Relationship = _Relationship.sort((x, y) => {
  if (x.Name > y.Name) {
    return 1;
  } else if (x.Name < y.Name) {
    return -1;
  } else {
    return 0; 
  }
}); 

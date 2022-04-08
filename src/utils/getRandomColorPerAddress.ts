const getRandomColorPerAddress = (addr: string) => {
  const stringUniqueHash = [...addr].reduce(
    (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
    0
  );
  return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
};

export default getRandomColorPerAddress;

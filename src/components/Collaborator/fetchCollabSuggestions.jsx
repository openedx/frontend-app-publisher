const contains = (stringA, stringB) => stringA.toLowerCase().includes(stringB.toLowerCase());
const filterSuggestions = (value, allCollaborators) => allCollaborators.filter(({ name }) => contains(name, value));

export default (all) => {
  const inner = (value) => Promise.resolve({ data: filterSuggestions(value, all) });
  return inner;
};

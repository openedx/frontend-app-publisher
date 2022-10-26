const contains = (stringA, stringB) => stringA.toLowerCase().includes(stringB.toLowerCase());
const filterSuggestions = (value, allCourseTags) => allCourseTags.filter(({ name }) => contains(name, value));

export default (allValues) => {
  const inner = (value) => Promise.resolve({ data: filterSuggestions(value, allValues) });
  return inner;
};

export const filterByText = <T>(items: T[], property: keyof T, searchText: string): T[] => {
  if (!searchText.trim()) {
    return [...items];
  } else {
    const filtered = items.filter(item => {
      const value = item[property];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchText.toLowerCase());
      }C:Users
aveeAppDataLocalTempgoogle-generative-ai	ool_code169341391	emp.ts:7:14: Expected '}'


      return false;
    });
    return filtered;
  }
};

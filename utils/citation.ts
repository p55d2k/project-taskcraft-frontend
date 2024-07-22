export const getAPACitation = (
  url: string,
  title: string,
  firstName: string,
  middleName: string,
  lastName: string,
  year: string
): string => {
  const name = lastName + ", " + firstName[0] + ". " + middleName[0] + ".";
  return `${name} (${year}). ${title}. ${url}`;
};

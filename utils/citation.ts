export type WebsiteCitation = {
  url: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  year: string;
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getAPAWebsiteCitation = (data: WebsiteCitation): string => {
  if (
    !data.url ||
    !data.title ||
    !data.firstName ||
    !data.lastName ||
    !data.year
  ) {
    throw new Error("Missing required fields");
  }

  const name = `${capitalizeFirstLetter(
    data.lastName
  )}, ${data.firstName[0].toLocaleUpperCase()}.${
    data.middleName && " " + data.middleName[0].toLocaleUpperCase() + "."
  }`;
  return `${name} (${data.year}). ${data.title}. ${data.url}`;
};

export const getAPAWebsiteInTextCitation = (data: WebsiteCitation): string => {
  if (!data.lastName || !data.year) {
    throw new Error("Missing required fields");
  }

  const name = `${capitalizeFirstLetter(data.lastName)}`;
  return `(${name}, ${data.year})`;
};

export const pageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.status !== 404;
  } catch (error) {
    console.error("Error checking page existence:", error);
    return false;
  }
};

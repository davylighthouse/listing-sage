
export const EXPECTED_COLUMNS = 24;
export const REQUIRED_HEADERS = [
  "Data Start Date",
  "Data End Date",
  "Listing Title",
  "eBay Item ID",
  "Total Impressions on eBay Site"
];

export const validateCSVFormat = (headers: string[]): boolean => {
  if (headers.length !== EXPECTED_COLUMNS) {
    throw new Error(`Expected ${EXPECTED_COLUMNS} columns but found ${headers.length}. Please ensure you're using the correct CSV template.`);
  }

  // Check at least the first few critical headers
  for (let i = 0; i < REQUIRED_HEADERS.length; i++) {
    if (!headers[i].toLowerCase().includes(REQUIRED_HEADERS[i].toLowerCase())) {
      throw new Error(`Invalid CSV format. Expected column "${REQUIRED_HEADERS[i]}" but found "${headers[i]}"`);
    }
  }
  return true;
};

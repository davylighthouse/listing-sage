
const UploadInstructions = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900">Upload CSV</h2>
      <p className="mt-1 text-gray-500">
        Import your eBay listing data by uploading a CSV file
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Your CSV file should contain the following columns in order:
      </p>
      <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
        <li>Data Start Date</li>
        <li>Data End Date</li>
        <li>Listing Title</li>
        <li>eBay Item ID</li>
        <li>And other metrics...</li>
      </ul>
    </div>
  );
};

export default UploadInstructions;

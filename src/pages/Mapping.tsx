
import { DataMappingForm } from "@/components/mapping/DataMappingForm";

const MappingPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Data Mapping Configuration</h1>
      <DataMappingForm />
    </div>
  );
};

export default MappingPage;

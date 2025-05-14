export default function ProductDescription({ description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Service Description</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

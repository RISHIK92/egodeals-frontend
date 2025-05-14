export default function LocationMap({ location }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Location</h2>
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map of {location}</p>
      </div>
    </div>
  );
}

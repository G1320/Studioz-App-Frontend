interface GenericDetailProps<T extends Record<string, unknown>> {
  data: T | null;
  className?: string;
}

const GenericDetail = <T extends Record<string, unknown>>({ data, className = '' }: GenericDetailProps<T>) => {
  if (!data) return null;

  return (
    <div className={`generic-details ${className}`}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {String(value)}
        </div>
      ))}
    </div>
  );
};

export default GenericDetail;

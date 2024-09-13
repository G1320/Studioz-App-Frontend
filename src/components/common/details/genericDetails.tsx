interface GenericDetailProps {
  data: Record<string, any> | null;
  className?: string;
}

const GenericDetail: React.FC<GenericDetailProps> = ({ data, className = '' }) => {
  if (!data) return null;

  return (
    <div className={`generic-details ${className}`}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))}
    </div>
  );
};

export default GenericDetail;

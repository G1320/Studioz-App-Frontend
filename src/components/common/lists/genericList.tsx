interface GenericListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  className?: string;
}

export const GenericList = <T,>({
  data,
  renderItem,
  keyExtractor,
  className = '',
}: GenericListProps<T>): JSX.Element => {
  return (
    <section className={`generic-list ${className}`}>
      {data.map((item, index) => (
        <div
          className="render-item-container"
          key={keyExtractor ? keyExtractor(item, index) : index}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </section>
  );
};



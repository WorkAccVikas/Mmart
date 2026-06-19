interface IDefaultCardProps {
  index: number;
}

const DefaultCard = ({ index }: IDefaultCardProps) => {
  return (
    <div className="w-full rounded-lg border p-4">
      <h3 className="text-lg font-medium">Card {index + 1}</h3>

      <p className="text-muted-foreground mt-2 text-sm">
        This is a default card.
      </p>
    </div>
  );
};

export default DefaultCard;

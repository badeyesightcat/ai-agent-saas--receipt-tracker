const HomeSectionHeader = ({
  isHero = false,
  title,
  description,
}: {
  isHero?: boolean;
  title: string;
  description: string;
}) => {
  return (
    <div className="space-y-2">
      {isHero ? (
        <h1 className="text-6xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl font-serif text-slate-800">
          {title}
        </h1>
      ) : (
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl font-serif">
          {title}
        </h2>
      )}

      <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default HomeSectionHeader;

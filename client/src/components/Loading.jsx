const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-5">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-fuchsia-500 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl animate-floaty">
          🎨
        </span>
      </div>
      <p className="text-sm text-slate-500 dark:text-white/50">Painting your imagination…</p>
    </div>
  );
};

export default Loading;

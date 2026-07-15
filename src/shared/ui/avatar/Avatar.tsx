interface AvatarProps {
  src: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = { xs: "h-6 w-6", sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12", xl: "h-16 w-16" };

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const initials = alt.slice(0, 2).toUpperCase();
  return src ? (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`rounded-full object-cover ${sizes[size]} ${className}`}
    />
  ) : (
    <div
      className={`rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold ${sizes[size]} ${className}`}
    >
      <span className="text-xs">{initials}</span>
    </div>
  );
}

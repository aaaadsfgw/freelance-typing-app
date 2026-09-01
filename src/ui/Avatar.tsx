type Props = {
  src: string;
  name: string;
};

export function Avatar({ src, name }: Props) {
  const initial = name.slice(0, 1);
  if (src.startsWith("/")) {
    return <img className="avatar-img" src={src} alt="" width={48} height={48} />;
  }
  return <div className="avatar">{initial}</div>;
}

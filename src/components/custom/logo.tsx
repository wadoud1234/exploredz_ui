import LogoImg from "./../../assets/images/logo.png";

type Props = Omit<React.ComponentProps<"img">, "src" | "alt">;

export default function Logo({ ...props }: Props) {
  return <img src={LogoImg} alt="logo" {...props} />;
}

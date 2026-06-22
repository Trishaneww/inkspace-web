// CSS
import clsx from "clsx";
import styles from "@/styles/InitialsAvatar.module.css";

// Libs
import { getAvatarVariant, getInitials } from "@/lib/avatar";

const VARIANT_CLASSES = [
  styles.variant0,
  styles.variant1,
  styles.variant2,
  styles.variant3,
];

interface InitialsAvatarProps {
  name: string;
  seed?: string;
}

export const InitialsAvatar = ({ name, seed }: InitialsAvatarProps) => {
  const variant = getAvatarVariant(seed ?? name);
  return (
    <span className={clsx(styles.avatar, VARIANT_CLASSES[variant])}>
      {getInitials(name)}
    </span>
  );
};

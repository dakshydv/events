import { LucideIcon, LucideProps } from "lucide-react";

type IconProps = LucideProps & {
    icon: LucideIcon;
};

export function Icon({ icon: IconComponent, className, ...props }: IconProps) {
    return <IconComponent className={className} {...props} />;
}

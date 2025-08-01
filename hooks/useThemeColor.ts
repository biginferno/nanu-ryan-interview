import { Colors } from "@/constants/Colors";

type Theme = "light" | "dark";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof (typeof Colors)["light"] | keyof (typeof Colors)["dark"]
) {
  const theme: Theme =  "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Fallback to color from Colors object, or undefined if not found
    return Colors[theme][colorName as keyof (typeof Colors)["light"]];
  }
}

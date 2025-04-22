import { Metadata } from "next";
import Colors from "./colors";

const appUrl = process.env.NEXT_PUBLIC_URL;

export async function generateMetadata(): Promise<Metadata> {
  const frame = {
    version: "next",
    imageUrl: `${appUrl}/opengraph-image`,
    button: {
      title: "Pick a Color",
      action: {
        type: "launch_frame",
        name: "Raid Colors",
        url: `${appUrl}`,
        iconImageUrl: `${appUrl}/trumpet.svg`,
        splashImageUrl: `${appUrl}/swords.svg`,
        splashBackgroundColor: "#ff3864",
      },
    },
  };
  return {
    title: "Raid Colors",
    openGraph: {
      title: "Raid Colors",
      description:
        "A Decentralized Collective of Colors Ready to Slay Your Web3 Product Demons.",
      images: `${appUrl}/swords.svg`,
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Page() {
  return <Colors />;
}

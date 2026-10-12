import LandingPage from "./components/landing/LandingPage";

export const metadata = {
  title: "Simpleads | Real-Time B2B Lead Generation & AI Scoring",
  description:
    "Find, score and export qualified B2B leads in real time — people search, company intel, hiring signals and Google Maps local search in one pipeline.",
  alternates: {
    canonical: "https://simpleads.live/",
  },
  openGraph: {
    title: "Simpleads | Real-Time B2B Lead Generation & AI Scoring",
    description:
      "Find, score and export qualified B2B leads in real time — people search, company intel, hiring signals and Google Maps local search in one pipeline.",
    url: "https://simpleads.live/",
  },
};

export default function Home() {
  return <LandingPage />;
}

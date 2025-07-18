import {
  Inter,
  Domine,
  Lora,
  Montserrat,
  Roboto,
  Poppins,
  Merriweather,
  Open_Sans,
  Source_Sans_3,
  Playfair_Display,
  Raleway,
  Nunito,
  PT_Sans,
  Lato,
  Ubuntu,
  Rubik,
  Oswald,
  Work_Sans,
  Mulish,
  Quicksand,
  DM_Sans,
  Noto_Sans,
  Crimson_Text,
  Fira_Sans,
  Source_Serif_4,
  Josefin_Sans,
  Inconsolata,
  Cabin,
  Prompt,
  Roboto_Mono,
  Roboto_Slab,
  Roboto_Condensed,
  Dancing_Script,
  Pacifico,
  Abril_Fatface,
  Righteous,
  Courgette,
  Lobster,
  Permanent_Marker,
} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const domine = Domine({
  subsets: ["latin"],
  variable: "--font-domine",
});

export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const ptSans = PT_Sans({
  subsets: ["latin"],
  variable: "--font-pt-sans",
  weight: ["400", "700"],
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

export const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
});

export const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson-text",
});

export const firaSans = Fira_Sans({
  subsets: ["latin"],
  variable: "--font-fira-sans",
  weight: ["400", "700"],
});

export const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif-4",
});

export const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin-sans",
});

export const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
});

export const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
});

export const prompt = Prompt({
  subsets: ["latin"],
  variable: "--font-prompt",
  weight: ["400", "700"],
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: ["400"],
});

export const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  variable: "--font-abril-fatface",
  weight: ["400"],
});

export const righteous = Righteous({
  subsets: ["latin"],
  variable: "--font-righteous",
  weight: ["400"],
});

export const courgette = Courgette({
  subsets: ["latin"],
  variable: "--font-courgette",
  weight: ["400"],
});

export const lobster = Lobster({
  subsets: ["latin"],
  variable: "--font-lobster",
  weight: ["400"],
});

export const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  weight: ["400"],
});

export const fonts = {
  arial: "Arial",
  inter: inter.style.fontFamily,
  domine: domine.style.fontFamily,
  lora: lora.style.fontFamily,
  montserrat: montserrat.style.fontFamily,
  roboto: roboto.style.fontFamily,
  poppins: poppins.style.fontFamily,
  merriweather: merriweather.style.fontFamily,
  openSans: openSans.style.fontFamily,
  sourceSans3: sourceSans3.style.fontFamily,
  playfairDisplay: playfairDisplay.style.fontFamily,
  raleway: raleway.style.fontFamily,
  nunito: nunito.style.fontFamily,
  ptSans: ptSans.style.fontFamily,
  lato: lato.style.fontFamily,
  ubuntu: ubuntu.style.fontFamily,
  rubik: rubik.style.fontFamily,
  oswald: oswald.style.fontFamily,
  workSans: workSans.style.fontFamily,
  mulish: mulish.style.fontFamily,
  quicksand: quicksand.style.fontFamily,
  dmSans: dmSans.style.fontFamily,
  notoSans: notoSans.style.fontFamily,
  crimsonText: crimsonText.style.fontFamily,
  firaSans: firaSans.style.fontFamily,
  sourceSerif4: sourceSerif4.style.fontFamily,
  josefinSans: josefinSans.style.fontFamily,
  inconsolata: inconsolata.style.fontFamily,
  cabin: cabin.style.fontFamily,
  prompt: prompt.style.fontFamily,
  robotoMono: robotoMono.style.fontFamily,
  robotoSlab: robotoSlab.style.fontFamily,
  robotoCondensed: robotoCondensed.style.fontFamily,
  dancingScript: dancingScript.style.fontFamily,
  pacifico: pacifico.style.fontFamily,
  abrilFatface: abrilFatface.style.fontFamily,
  righteous: righteous.style.fontFamily,
  courgette: courgette.style.fontFamily,
  lobster: lobster.style.fontFamily,
  permanentMarker: permanentMarker.style.fontFamily,
};

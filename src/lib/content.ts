import { photo } from "./images";

export const TAGLINE = "We provide professional Entertainment for live events!";
export const PHONE_DISPLAY = "(407) 808-9747";
export const PHONE_TEL = "4078089747";
export const EMAIL = "rjrtalent@gmail.com";
export const ADDRESS = "1920 Portcastle Circle, Winter Garden, FL 34787";
export const DEMO_EMAIL = "alex@rjrtalent.net";
export const DEMO_PASSWORD = "Talent2018";

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  image: string;
  includes: string[];
};

export type Talent = {
  slug: string;
  title: string;
  service: string;
  image: string;
  summary: string;
  detail: string;
  points: string[];
};

export type Occasion = {
  id: string;
  label: string;
  blurb: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  occasion: string;
  caption: string;
};

export type VideoItem = {
  id: string;
  src: string;
  title: string;
  talent: string;
  duration: string;
  caption: string;
};

export type Testimonial = {
  id: string;
  name: string;
  detail: string;
  quote: string;
  avatar: string;
  service: string;
};

export const services: Service[] = [
  {
    slug: "live-music",
    title: "Live Music Performances",
    blurb: "Bands and DJs that keep the room moving, from the first song to the last dance.",
    description:
      "RJR Talent represents live bands across rock ’n’ roll, country, jazz, R&B, blues, and dance, plus interactive DJs. Groups range from soloists to full bands. Musicians bring their own PA and dress for your theme.",
    image: photo("service-live-music.jpg"),
    includes: [
      "Rock, country, jazz, R&B, blues, and dance",
      "Soloists through full bands",
      "Interactive DJs who read the room",
      "PA systems provided by the musicians",
      "Attire matched to your occasion",
    ],
  },
  {
    slug: "specialty",
    title: "Specialty Acts",
    blurb:
      "Magicians, dancers, stilt walkers, and artists who make the night the story people retell.",
    description:
      "Specialty entertainment is built for galas, festivals, private parties, and anywhere a room needs a moment people will talk about. Every act is professional, prepared, and matched to your guests.",
    image: photo("service-specialty.jpg"),
    includes: [
      "Magicians and close-up magic",
      "Belly dancers and specialty dance",
      "Stilt walkers for festivals and arrivals",
      "Balloon artists for family celebrations",
      "MCs, makeup artists, and voice-over talent",
    ],
  },
  {
    slug: "custom",
    title: "Custom Entertainment",
    blurb: "A lineup designed around your vision, venue, and guests.",
    description:
      "Tell us the feeling you want and we shape the entertainment around it. Mix live music with specialty acts, time the reveals, and keep the evening flowing from cocktail hour to the last song.",
    image: photo("service-custom.jpg"),
    includes: [
      "A lineup planned around your theme",
      "Music and specialty acts in one booking",
      "Timing that fits your venue and schedule",
      "A single point of contact at the agency",
      "Fully insured performances",
    ],
  },
];

export const talents: Talent[] = [
  {
    slug: "live-bands",
    title: "Live Bands",
    service: "live-music",
    image: photo("talent-band.jpg"),
    summary: "Rock, country, jazz, R&B, blues, and dance.",
    detail:
      "From a trio at cocktail hour to a full dance band, our musicians are seasoned Central Florida performers. They bring their own sound and dress for themed nights, weddings, and galas.",
    points: [
      "Genres matched to your crowd",
      "Own PA system",
      "Theme-ready attire",
      "Sets built around your timeline",
    ],
  },
  {
    slug: "djs",
    title: "Interactive DJs",
    service: "live-music",
    image: photo("talent-dj.jpg"),
    summary: "DJs who read the room and keep the floor full.",
    detail:
      "An interactive DJ shapes the night in real time, from dinner background to a packed dance floor. Ideal for nightclubs, weddings, birthdays, and workplace parties.",
    points: [
      "Crowd-aware song flow",
      "Clean professional setup",
      "MC support available",
      "Indoor and outdoor events",
    ],
  },
  {
    slug: "belly-dancers",
    title: "Belly Dancers",
    service: "specialty",
    image: photo("talent-belly.jpg"),
    summary: "Elegant dance performances for galas and celebrations.",
    detail:
      "A specialty dance performance adds a graceful, high-energy moment to weddings, galas, and cultural celebrations. Performers are polished, professional, and comfortable in formal rooms.",
    points: [
      "Solo feature sets",
      "Formal-event experience",
      "Costume matched to the theme",
      "Stage or floor performance",
    ],
  },
  {
    slug: "balloon-artists",
    title: "Balloon Artists",
    service: "specialty",
    image: photo("talent-balloon.jpg"),
    summary: "Sculptures and smiles for family celebrations.",
    detail:
      "Balloon artists turn children’s parties and family welcomes into something guests can hold onto. Bright, wholesome, and paced for the room.",
    points: ["Custom sculptures", "Party-ready pacing", "Family celebrations", "Indoor setups"],
  },
  {
    slug: "magicians",
    title: "Magicians",
    service: "specialty",
    image: photo("talent-magician.jpg"),
    summary: "Close-up magic and stage sets that hold a room.",
    detail:
      "Close-up magic for cocktail hours, or a stage set that becomes the centerpiece of a gala. Our magicians are used to elegant rooms and curious crowds.",
    points: [
      "Close-up or stage",
      "Cocktail-hour roaming",
      "Corporate and private events",
      "Family-friendly options",
    ],
  },
  {
    slug: "makeup-artists",
    title: "Makeup Artists",
    service: "specialty",
    image: photo("talent-makeup.jpg"),
    summary: "Event makeup for the people in the spotlight.",
    detail:
      "Polished event makeup for hosts, wedding parties, and on-camera moments. Calm, professional, and timed around your schedule.",
    points: ["Wedding parties", "On-camera ready", "On-site service", "Natural or glam looks"],
  },
  {
    slug: "mcs",
    title: "MCs",
    service: "specialty",
    image: photo("talent-mc.jpg"),
    summary: "Hosts who keep the program moving.",
    detail:
      "A confident MC welcomes guests, introduces acts, and keeps a gala or conference on time without losing the warmth of the room.",
    points: [
      "Gala and conference hosting",
      "Act introductions",
      "Timeline discipline",
      "Formal or lively tone",
    ],
  },
  {
    slug: "stilt-walkers",
    title: "Stilt Walkers",
    service: "specialty",
    image: photo("talent-stilt.jpg"),
    summary: "Towering welcome acts for festivals and arrivals.",
    detail:
      "Stilt walkers draw a crowd at festivals, outdoor receptions, and grand entrances. Costumes can lean theatrical, elegant, or playful.",
    points: ["Outdoor festivals", "Arrival moments", "Costume options", "Crowd-friendly roaming"],
  },
  {
    slug: "voice-over",
    title: "Voice Over Artists",
    service: "specialty",
    image: photo("talent-voice.jpg"),
    summary: "Voices for spots, events, and announcements.",
    detail:
      "Professional voice-over for event opens, sponsor reads, and recorded pieces. Clear, warm, and directed to match the tone of your program.",
    points: ["Event opens", "Sponsor reads", "Recorded or live", "Tone matched to the brand"],
  },
];

export const occasions: Occasion[] = [
  {
    id: "wedding",
    label: "Weddings",
    blurb: "Ceremony-to-reception energy, including the last dance.",
  },
  { id: "birthday", label: "Birthdays", blurb: "A soundtrack and a surprise that feel personal." },
  { id: "wine", label: "Wine Tastings", blurb: "Low, elegant sets that let conversation lead." },
  { id: "dance", label: "Dance Parties", blurb: "A floor that stays full from the first drop." },
  { id: "festival", label: "Festivals", blurb: "Roaming acts and stages built for a crowd." },
  { id: "concert", label: "Concerts", blurb: "Live bands with the presence of a real show." },
  { id: "convention", label: "Conventions", blurb: "Entertainment that gives a program a pulse." },
  { id: "nightclub", label: "Nightclubs", blurb: "DJs and live sets for late rooms." },
  { id: "home", label: "Private Homes", blurb: "Polished acts sized for a house party." },
  { id: "kids", label: "Children’s Parties", blurb: "Balloon artists and family-friendly magic." },
  { id: "workplace", label: "Workplace", blurb: "Celebrations your team will actually enjoy." },
];

export const gallery: GalleryItem[] = [
  {
    id: "g-wedding",
    src: photo("gallery-wedding.jpg"),
    title: "Wedding reception",
    occasion: "Weddings",
    caption: "A packed dance floor and a band that stayed with the room.",
  },
  {
    id: "g-wine",
    src: photo("gallery-wine.jpg"),
    title: "Wine tasting",
    occasion: "Wine Tastings",
    caption: "A quiet jazz set beside the pour.",
  },
  {
    id: "g-birthday",
    src: photo("gallery-birthday.jpg"),
    title: "Birthday party",
    occasion: "Birthdays",
    caption: "String lights, a full floor, and a night that felt easy.",
  },
  {
    id: "g-club",
    src: photo("gallery-nightclub.jpg"),
    title: "Nightclub",
    occasion: "Nightclubs",
    caption: "Blue light, a late set, and a room that stayed.",
  },
  {
    id: "g-gala",
    src: photo("gallery-gala.jpg"),
    title: "Corporate gala",
    occasion: "Workplace",
    caption: "Candlelight tables and a performance guests talked about after.",
  },
  {
    id: "g-kids",
    src: photo("gallery-kids.jpg"),
    title: "Children’s party",
    occasion: "Children’s Parties",
    caption: "Color, balloons, and a celebration sized for families.",
  },
  {
    id: "g-festival",
    src: photo("gallery-festival.jpg"),
    title: "Outdoor festival",
    occasion: "Festivals",
    caption: "Dusk, a crowd, and a stage that carried the field.",
  },
  {
    id: "g-concert",
    src: photo("gallery-concert.jpg"),
    title: "Concert",
    occasion: "Concerts",
    caption: "A live band under warm light and blue beams.",
  },
  {
    id: "g-outdoor",
    src: photo("gallery-outdoor.jpg"),
    title: "Garden reception",
    occasion: "Weddings",
    caption: "Twilight, string lights, and a guitar carrying the lawn.",
  },
  {
    id: "g-corporate",
    src: photo("gallery-corporate.jpg"),
    title: "Workplace celebration",
    occasion: "Workplace",
    caption: "An acoustic set for a team that earned the night.",
  },
  {
    id: "g-reception",
    src: photo("gallery-reception.jpg"),
    title: "Cocktail hour",
    occasion: "Weddings",
    caption: "A toast, a trio, and the start of the evening.",
  },
  {
    id: "g-convention",
    src: photo("gallery-convention.jpg"),
    title: "Convention night",
    occasion: "Conventions",
    caption: "After the program, a ballroom that finally danced.",
  },
  {
    id: "g-home",
    src: photo("gallery-home.jpg"),
    title: "Private home",
    occasion: "Private Homes",
    caption: "A living room turned into a small, perfect club.",
  },
];

export const videos: VideoItem[] = [
  {
    id: "v-band",
    src: photo("video-band.jpg"),
    title: "Live Band",
    talent: "live-bands",
    duration: "2:18",
    caption: "A festival-stage highlight with vocals, guitar, and a room already moving.",
  },
  {
    id: "v-dj",
    src: photo("video-dj.jpg"),
    title: "Interactive DJ",
    talent: "djs",
    duration: "1:46",
    caption: "Club lighting and a set built to keep the floor together.",
  },
  {
    id: "v-magic",
    src: photo("video-magician.jpg"),
    title: "Magician",
    talent: "magicians",
    duration: "3:02",
    caption: "A close-up moment from a gala cocktail hour.",
  },
  {
    id: "v-belly",
    src: photo("talent-belly.jpg"),
    title: "Belly Dancer",
    talent: "belly-dancers",
    duration: "2:05",
    caption: "A specialty dance feature under warm light and blue wash.",
  },
  {
    id: "v-balloon",
    src: photo("video-balloon.jpg"),
    title: "Balloon Artist",
    talent: "balloon-artists",
    duration: "1:33",
    caption: "A sculpture taking shape at a family celebration.",
  },
  {
    id: "v-stilt",
    src: photo("video-stilt.jpg"),
    title: "Stilt Walker",
    talent: "stilt-walkers",
    duration: "2:27",
    caption: "A towering welcome moving through an evening festival.",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Claire & Jason P.",
    detail: "Wedding reception",
    service: "Live Music",
    avatar: photo("avatar-claire.jpg"),
    quote:
      "The live music was fantastic. Their musicians kept everyone dancing all night. From the first note to the last, they set the mood for our wedding reception.",
  },
  {
    id: "t2",
    name: "Mark L.",
    detail: "Annual gala",
    service: "Specialty Acts",
    avatar: photo("avatar-mark.jpg"),
    quote:
      "We hired RJR for a specialty act at our annual gala, and it was the highlight of the night. The performer held the room. Unforgettable, one-of-a-kind entertainment.",
  },
  {
    id: "t3",
    name: "Olivia H.",
    detail: "Custom event",
    service: "Custom",
    avatar: photo("avatar-olivia.jpg"),
    quote:
      "They listened, understood the goal, and built the right experience. Custom acts and live performance made the event feel personal.",
  },
  {
    id: "t4",
    name: "Tom & Melissa W.",
    detail: "Celebration",
    service: "Live Music",
    avatar: photo("avatar-tom.jpg"),
    quote:
      "RJR’s live music turned our event into a real celebration. The band was professional, engaging, and incredibly talented. Our guests were blown away.",
  },
  {
    id: "t5",
    name: "Emily R.",
    detail: "Private celebration",
    service: "Live Music",
    avatar: photo("avatar-emily.jpg"),
    quote:
      "The band had incredible energy and set the perfect tone. Our guests could not stop talking about the music. RJR knows how to read a room.",
  },
  {
    id: "t6",
    name: "John T.",
    detail: "Corporate event",
    service: "Specialty Acts",
    avatar: photo("avatar-john.jpg"),
    quote:
      "The specialty act was a showstopper. Unique, engaging, and tailored to our audience. Our team is still talking about it.",
  },
];

export const heroImage = photo("hero-home.jpg");
export const splashImage = photo("splash-lights.jpg");

export const onboarding = [
  {
    image: photo("onboarding-wedding.jpg"),
    title: "Talent You Can Count On",
    body: "Discover professional bands, DJs, magicians, dancers and more, all vetted by a licensed agency.",
  },
  {
    image: photo("onboarding-magician.jpg"),
    title: "Entertainment Tailored to Your Event",
    body: "Live music, specialty acts, or fully custom entertainment, built around your vision and venue.",
  },
  {
    image: photo("onboarding-festival.jpg"),
    title: "Request a Talent in Minutes",
    body: "Tell us about your event, and our team will get back to you with the perfect lineup.",
  },
];

export function serviceBySlug(slug: string) {
  return services.find((item) => item.slug === slug);
}

export function talentBySlug(slug: string) {
  return talents.find((item) => item.slug === slug);
}

export function occasionById(id: string) {
  return occasions.find((item) => item.id === id);
}

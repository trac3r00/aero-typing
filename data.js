// ── AIRPORT DATABASE ──
const AIRPORTS = {
  // North America
  JFK: { name: "John F. Kennedy International Airport", city: "New York", country: "United States", lat: 40.64, lon: -73.78, fact: "JFK handles over 60 million passengers annually and has 6 terminals" },
  LAX: { name: "Los Angeles International Airport", city: "Los Angeles", country: "United States", lat: 33.94, lon: -118.41, fact: "LAX's iconic Theme Building was designed in 1961 as a Space Age landmark" },
  ORD: { name: "O'Hare International Airport", city: "Chicago", country: "United States", lat: 41.98, lon: -87.90, fact: "O'Hare was once the world's busiest airport and has underground neon tunnels" },
  ATL: { name: "Hartsfield-Jackson Atlanta International Airport", city: "Atlanta", country: "United States", lat: 33.64, lon: -84.43, fact: "ATL has been the world's busiest airport by passenger traffic since 1998" },
  DFW: { name: "Dallas/Fort Worth International Airport", city: "Dallas", country: "United States", lat: 32.90, lon: -97.04, fact: "DFW is larger than Manhattan island at 17,207 acres" },
  SFO: { name: "San Francisco International Airport", city: "San Francisco", country: "United States", lat: 37.62, lon: -122.38, fact: "SFO has its own museum and aquarium inside the terminals" },
  MIA: { name: "Miami International Airport", city: "Miami", country: "United States", lat: 25.80, lon: -80.29, fact: "MIA is the largest US gateway to Latin America and the Caribbean" },
  SEA: { name: "Seattle-Tacoma International Airport", city: "Seattle", country: "United States", lat: 47.45, lon: -122.31, fact: "Sea-Tac has a massive indoor forest with actual trees between gates" },
  BOS: { name: "Boston Logan International Airport", city: "Boston", country: "United States", lat: 42.37, lon: -71.02, fact: "Logan was one of the first airports in the US, opening in 1923" },
  DEN: { name: "Denver International Airport", city: "Denver", country: "United States", lat: 39.86, lon: -104.67, fact: "DEN's tent-like roof is designed to resemble the snow-capped Rocky Mountains" },
  MSP: { name: "Minneapolis-Saint Paul International Airport", city: "Minneapolis", country: "United States", lat: 44.88, lon: -93.22, fact: "MSP is home to the Mall of America, reachable by light rail from the airport" },
  DTW: { name: "Detroit Metropolitan Wayne County Airport", city: "Detroit", country: "United States", lat: 42.21, lon: -83.35, fact: "DTW's McNamara Terminal has one of the world's longest airport concourses" },
  PHX: { name: "Phoenix Sky Harbor International Airport", city: "Phoenix", country: "United States", lat: 33.44, lon: -112.01, fact: "Sky Harbor serves over 46 million passengers per year in the Arizona desert" },
  IAH: { name: "George Bush Intercontinental Airport", city: "Houston", country: "United States", lat: 29.98, lon: -95.34, fact: "IAH is United Airlines' largest hub by destinations served" },
  EWR: { name: "Newark Liberty International Airport", city: "Newark", country: "United States", lat: 40.69, lon: -74.17, fact: "Newark was the first major airport in the New York metropolitan area" },
  YYZ: { name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada", lat: 43.68, lon: -79.63, fact: "Pearson is Canada's largest and busiest airport with two terminals" },
  YVR: { name: "Vancouver International Airport", city: "Vancouver", country: "Canada", lat: 49.19, lon: -123.18, fact: "YVR has a 114,000-gallon aquarium in the international terminal" },
  MEX: { name: "Mexico City International Airport", city: "Mexico City", country: "Mexico", lat: 19.44, lon: -99.07, fact: "Benito Juarez Airport sits at 7,316 feet elevation, one of the highest major airports" },
  GRU: { name: "Sao Paulo-Guarulhos International Airport", city: "Sao Paulo", country: "Brazil", lat: -23.43, lon: -46.47, fact: "Guarulhos is the busiest airport in South America" },
  EZE: { name: "Ministro Pistarini International Airport", city: "Buenos Aires", country: "Argentina", lat: -34.82, lon: -58.54, fact: "Ezeiza airport is named after the town where it's located, 22 km from Buenos Aires" },
  BOG: { name: "El Dorado International Airport", city: "Bogota", country: "Colombia", lat: 4.70, lon: -74.15, fact: "El Dorado handles more cargo than any other airport in Latin America" },
  LIM: { name: "Jorge Chavez International Airport", city: "Lima", country: "Peru", lat: -12.02, lon: -77.11, fact: "Jorge Chavez sits right next to the Pacific Ocean coastline" },
  SCL: { name: "Arturo Merino Benitez International Airport", city: "Santiago", country: "Chile", lat: -33.39, lon: -70.79, fact: "Santiago's airport is the main gateway to South America's wine country" },

  // Europe
  LHR: { name: "London Heathrow Airport", city: "London", country: "United Kingdom", lat: 51.47, lon: -0.46, fact: "Heathrow is Europe's busiest airport with over 80 million passengers a year" },
  CDG: { name: "Charles de Gaulle Airport", city: "Paris", country: "France", lat: 49.01, lon: 2.55, fact: "CDG's Terminal 1 is shaped like an octopus with seven satellite buildings" },
  FRA: { name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", lat: 50.03, lon: 8.57, fact: "Frankfurt is the busiest airport in Germany and a major Lufthansa hub" },
  AMS: { name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands", lat: 52.31, lon: 4.77, fact: "Schiphol sits 3 meters below sea level, one of the lowest airports in the world" },
  MAD: { name: "Adolfo Suarez Madrid-Barajas Airport", city: "Madrid", country: "Spain", lat: 40.47, lon: -3.57, fact: "Terminal 4 at Madrid has a stunning bamboo-lined ceiling by Richard Rogers" },
  FCO: { name: "Leonardo da Vinci-Fiumicino Airport", city: "Rome", country: "Italy", lat: 41.80, lon: 12.25, fact: "Fiumicino is named after Leonardo da Vinci and sits near ancient Roman ruins" },
  IST: { name: "Istanbul Airport", city: "Istanbul", country: "Turkey", lat: 41.26, lon: 28.74, fact: "Istanbul Airport is designed to be the world's largest, handling 200M passengers" },
  ZRH: { name: "Zurich Airport", city: "Zurich", country: "Switzerland", lat: 47.46, lon: 8.55, fact: "Zurich Airport has a viewing terrace and a mini-golf course on the grounds" },
  BCN: { name: "Barcelona-El Prat Airport", city: "Barcelona", country: "Spain", lat: 41.30, lon: 2.08, fact: "El Prat's Terminal 1 was designed by Ricardo Bofill with flowing, organic lines" },
  MUC: { name: "Munich Airport", city: "Munich", country: "Germany", lat: 48.35, lon: 11.79, fact: "Munich Airport has its own brewery and beer garden between terminals" },
  CPH: { name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", lat: 55.62, lon: 12.66, fact: "Kastrup is the oldest operating airport in Scandinavia, opened in 1925" },
  OSL: { name: "Oslo Airport Gardermoen", city: "Oslo", country: "Norway", lat: 60.19, lon: 11.10, fact: "Gardermoen's terminal is one of the world's most environmentally friendly" },
  ARN: { name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Sweden", lat: 59.65, lon: 17.95, fact: "Arlanda has a Jumbo Stay hostel inside a converted Boeing 747" },
  HEL: { name: "Helsinki Airport", city: "Helsinki", country: "Finland", lat: 60.32, lon: 24.97, fact: "Helsinki Airport has a sauna available for passengers" },
  VIE: { name: "Vienna International Airport", city: "Vienna", country: "Austria", lat: 48.11, lon: 16.57, fact: "Vienna Airport has won multiple awards for service quality in Europe" },
  DUB: { name: "Dublin Airport", city: "Dublin", country: "Ireland", lat: 53.43, lon: -6.27, fact: "Dublin Airport has US Customs pre-clearance, so you arrive as a domestic passenger" },
  LIS: { name: "Lisbon Humberto Delgado Airport", city: "Lisbon", country: "Portugal", lat: 38.77, lon: -9.13, fact: "Lisbon's airport is located just 7 km from the city center" },
  ATH: { name: "Athens International Airport", city: "Athens", country: "Greece", lat: 37.94, lon: 23.94, fact: "Athens Airport has an archaeological museum showcasing artifacts found during construction" },
  WAW: { name: "Warsaw Chopin Airport", city: "Warsaw", country: "Poland", lat: 52.17, lon: 20.97, fact: "Named after composer Frederic Chopin, the airport has a piano in the terminal" },
  PRG: { name: "Vaclav Havel Airport Prague", city: "Prague", country: "Czech Republic", lat: 50.10, lon: 14.26, fact: "Prague Airport is named after playwright and former president Vaclav Havel" },

  // Asia
  ICN: { name: "Incheon International Airport", city: "Seoul", country: "South Korea", lat: 37.46, lon: 126.44, fact: "Incheon has free showers, a Korean culture center, and an ice skating rink" },
  NRT: { name: "Narita International Airport", city: "Tokyo", country: "Japan", lat: 35.76, lon: 140.39, fact: "Narita has capsule hotels and Japanese gardens inside the terminal" },
  HND: { name: "Tokyo Haneda Airport", city: "Tokyo", country: "Japan", lat: 35.55, lon: 139.78, fact: "Haneda is one of the world's busiest airports and only 30 minutes from central Tokyo" },
  SIN: { name: "Singapore Changi Airport", city: "Singapore", country: "Singapore", lat: 1.36, lon: 103.99, fact: "Changi Airport has a 40-meter indoor waterfall called the Rain Vortex" },
  HKG: { name: "Hong Kong International Airport", city: "Hong Kong", country: "China", lat: 22.31, lon: 113.91, fact: "HKIA was built on a completely artificial island called Chek Lap Kok" },
  PEK: { name: "Beijing Capital International Airport", city: "Beijing", country: "China", lat: 40.08, lon: 116.58, fact: "Terminal 3 at PEK is shaped like a dragon when viewed from above" },
  PVG: { name: "Shanghai Pudong International Airport", city: "Shanghai", country: "China", lat: 31.14, lon: 121.81, fact: "Pudong connects to the city via the world's fastest commercial maglev train" },
  BKK: { name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", lat: 13.69, lon: 100.75, fact: "Suvarnabhumi means 'Golden Land' in Sanskrit" },
  KUL: { name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia", lat: 2.75, lon: 101.71, fact: "KLIA was designed by Kisho Kurokawa and sits in a tropical rainforest preserve" },
  DEL: { name: "Indira Gandhi International Airport", city: "New Delhi", country: "India", lat: 28.56, lon: 77.10, fact: "DEL's Terminal 3 has 95 aerobridges and artistic mudra hand sculptures" },
  BOM: { name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India", lat: 19.09, lon: 72.87, fact: "Mumbai Airport's Terminal 2 features a stunning art museum called Jaya He" },
  DOH: { name: "Hamad International Airport", city: "Doha", country: "Qatar", lat: 25.26, lon: 51.61, fact: "Hamad Airport has a giant teddy bear sculpture and indoor tropical garden" },
  DXB: { name: "Dubai International Airport", city: "Dubai", country: "UAE", lat: 25.25, lon: 55.36, fact: "Dubai's Terminal 3 is the world's largest building by floor space" },
  AUH: { name: "Abu Dhabi International Airport", city: "Abu Dhabi", country: "UAE", lat: 24.44, lon: 54.65, fact: "Abu Dhabi's Midfield Terminal has a stunning X-shaped design" },
  TPE: { name: "Taiwan Taoyuan International Airport", city: "Taipei", country: "Taiwan", lat: 25.08, lon: 121.23, fact: "Taoyuan offers free city tours for transit passengers with long layovers" },
  CGK: { name: "Soekarno-Hatta International Airport", city: "Jakarta", country: "Indonesia", lat: -6.13, lon: 106.66, fact: "Terminal 3 at CGK was designed to handle 25 million passengers annually" },
  MNL: { name: "Ninoy Aquino International Airport", city: "Manila", country: "Philippines", lat: 14.51, lon: 121.02, fact: "NAIA is named after the assassinated Philippine senator Ninoy Aquino" },
  SGN: { name: "Tan Son Nhat International Airport", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.82, lon: 106.65, fact: "Tan Son Nhat was a major military airbase during the Vietnam War" },
  HAN: { name: "Noi Bai International Airport", city: "Hanoi", country: "Vietnam", lat: 21.22, lon: 105.81, fact: "Noi Bai's Terminal 2 was designed by a Japanese architectural firm" },

  // Oceania
  SYD: { name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia", lat: -33.95, lon: 151.18, fact: "Sydney Airport is one of the oldest continuously operating airports in the world" },
  MEL: { name: "Melbourne Airport", city: "Melbourne", country: "Australia", lat: -37.67, lon: 144.84, fact: "Melbourne Airport has no curfew, operating 24 hours a day" },
  AKL: { name: "Auckland Airport", city: "Auckland", country: "New Zealand", lat: -37.01, lon: 174.79, fact: "Auckland Airport has Maori carvings and cultural displays throughout" },

  // Africa
  JNB: { name: "O.R. Tambo International Airport", city: "Johannesburg", country: "South Africa", lat: -26.14, lon: 28.25, fact: "OR Tambo is Africa's busiest airport by total passenger traffic" },
  CPT: { name: "Cape Town International Airport", city: "Cape Town", country: "South Africa", lat: -33.97, lon: 18.60, fact: "Cape Town Airport has views of Table Mountain from the runway" },
  CAI: { name: "Cairo International Airport", city: "Cairo", country: "Egypt", lat: 30.12, lon: 31.40, fact: "Cairo Airport is the busiest in Egypt and a gateway to the Pyramids" },
  NBO: { name: "Jomo Kenyatta International Airport", city: "Nairobi", country: "Kenya", lat: -1.32, lon: 36.93, fact: "JKIA is named after Kenya's first president and is East Africa's largest airport" },
  ADD: { name: "Addis Ababa Bole International Airport", city: "Addis Ababa", country: "Ethiopia", lat: 8.98, lon: 38.80, fact: "Bole is the hub for Ethiopian Airlines, Africa's largest carrier" },
  CMN: { name: "Mohammed V International Airport", city: "Casablanca", country: "Morocco", lat: 33.37, lon: -7.59, fact: "Casablanca's airport serves as the main gateway to Morocco" },
  LOS: { name: "Murtala Muhammed International Airport", city: "Lagos", country: "Nigeria", lat: 6.58, lon: 3.32, fact: "Lagos Airport serves West Africa's largest city with over 20 million people" },
  ACC: { name: "Kotoka International Airport", city: "Accra", country: "Ghana", lat: 5.61, lon: -0.17, fact: "Kotoka recently opened a new Terminal 3 with modern facilities" },

  // Middle East
  RUH: { name: "King Khalid International Airport", city: "Riyadh", country: "Saudi Arabia", lat: 24.96, lon: 46.70, fact: "King Khalid has a royal terminal exclusively for the Saudi royal family" },
  JED: { name: "King Abdulaziz International Airport", city: "Jeddah", country: "Saudi Arabia", lat: 21.67, lon: 39.16, fact: "Jeddah's Hajj Terminal can accommodate 80,000 pilgrims at once" },
  AMM: { name: "Queen Alia International Airport", city: "Amman", country: "Jordan", lat: 31.72, lon: 35.99, fact: "Queen Alia features a stunning undulating roof inspired by Bedouin tents" },
  TLV: { name: "Ben Gurion Airport", city: "Tel Aviv", country: "Israel", lat: 32.01, lon: 34.89, fact: "Ben Gurion is considered one of the most secure airports in the world" },
  BAH: { name: "Bahrain International Airport", city: "Manama", country: "Bahrain", lat: 26.27, lon: 50.63, fact: "Bahrain's new terminal was designed to resemble a desert island oasis" },
  MCT: { name: "Muscat International Airport", city: "Muscat", country: "Oman", lat: 23.59, lon: 58.28, fact: "Muscat Airport's design is inspired by traditional Omani architecture" }
};

// ── JOURNEY ROUTES ──
const JOURNEYS = [
  {
    id: "nyc-to-seoul",
    name: "New York to Seoul",
    icon: "\ud83d\uddfd\u2192\ud83c\uddf0\ud83c\uddf7",
    description: "Cross the Atlantic and Asia",
    difficulty: "Medium",
    stops: ["JFK", "LHR", "DXB", "SIN", "ICN"]
  },
  {
    id: "london-to-sydney",
    name: "London to Sydney",
    icon: "\ud83c\uddec\ud83c\udde7\u2192\ud83c\udde6\ud83c\uddfa",
    description: "The Kangaroo Route",
    difficulty: "Medium",
    stops: ["LHR", "DXB", "SIN", "SYD"]
  },
  {
    id: "around-the-world",
    name: "Around the World",
    icon: "\ud83c\udf0d\u2708\ufe0f\ud83c\udf0f",
    description: "Full circumnavigation",
    difficulty: "Hard",
    stops: ["JFK", "LHR", "CDG", "FRA", "IST", "DXB", "DEL", "BKK", "SIN", "HKG", "NRT", "ICN", "LAX", "SFO", "DEN", "JFK"]
  },
  {
    id: "us-coast-to-coast",
    name: "US Coast to Coast",
    icon: "\ud83c\udf05\u2192\ud83c\udf04",
    description: "Atlantic to Pacific via major hubs",
    difficulty: "Easy",
    stops: ["BOS", "JFK", "EWR", "ATL", "ORD", "DFW", "DEN", "LAX"]
  },
  {
    id: "european-tour",
    name: "European Grand Tour",
    icon: "\ud83c\uddea\ud83c\uddfa",
    description: "Major European capitals",
    difficulty: "Medium",
    stops: ["LHR", "CDG", "AMS", "FRA", "ZRH", "FCO", "MAD", "BCN", "LIS", "DUB"]
  },
  {
    id: "asian-explorer",
    name: "Asian Explorer",
    icon: "\ud83c\udf0f",
    description: "Discover Asia's great airports",
    difficulty: "Medium",
    stops: ["ICN", "NRT", "HND", "PVG", "HKG", "TPE", "MNL", "SGN", "BKK", "KUL", "SIN", "DEL"]
  },
  {
    id: "the-americas",
    name: "The Americas",
    icon: "\ud83c\udf0e",
    description: "North to South America",
    difficulty: "Hard",
    stops: ["YYZ", "JFK", "MIA", "MEX", "BOG", "LIM", "SCL", "EZE", "GRU", "ATL", "DFW", "SEA", "YVR"]
  },
  {
    id: "middle-east-africa",
    name: "Middle East & Africa",
    icon: "\ud83c\udfdc\ufe0f\u2192\ud83c\udf0d",
    description: "Desert hubs to African cities",
    difficulty: "Hard",
    stops: ["DXB", "DOH", "AUH", "RUH", "JED", "AMM", "CAI", "ADD", "NBO", "JNB", "CPT", "CMN"]
  }
];

// ── PRACTICE CATEGORIES ──
const CATEGORIES = {
  international: {
    name: "International Airlines",
    icon: "\ud83c\udf0d",
    description: "Major airlines from around the world",
    words: [
      "American Airlines", "Delta Air Lines", "United Airlines", "Southwest Airlines",
      "British Airways", "Lufthansa", "Air France", "KLM Royal Dutch Airlines",
      "Emirates", "Qatar Airways", "Singapore Airlines", "Cathay Pacific",
      "Japan Airlines", "All Nippon Airways", "Korean Air", "Asiana Airlines",
      "Turkish Airlines", "Qantas", "Air Canada", "LATAM Airlines",
      "Etihad Airways", "Swiss International Air Lines", "Iberia", "Aer Lingus",
      "Scandinavian Airlines", "Finnair", "LOT Polish Airlines", "TAP Air Portugal",
      "Virgin Atlantic", "EasyJet", "Ryanair", "Norwegian Air Shuttle",
      "Alaska Airlines", "JetBlue Airways", "Spirit Airlines", "Frontier Airlines",
      "Hawaiian Airlines", "Avianca", "Copa Airlines", "Aeromexico",
      "China Southern Airlines", "China Eastern Airlines", "Air China", "Hainan Airlines",
      "Thai Airways", "Vietnam Airlines", "Philippine Airlines", "Garuda Indonesia",
      "Malaysia Airlines", "IndiGo", "Air India", "SpiceJet",
      "EgyptAir", "Ethiopian Airlines", "South African Airways", "Royal Air Maroc",
      "Kenya Airways", "Saudia", "Gulf Air", "Oman Air",
      "El Al Israel Airlines", "Royal Jordanian", "Middle East Airlines",
      "Air New Zealand", "Fiji Airways", "ITA Airways"
    ]
  },
  us_domestic: {
    name: "US Domestic Airlines",
    icon: "\ud83c\uddfa\ud83c\uddf8",
    description: "Airlines operating within the United States",
    words: [
      "American Airlines", "Delta Air Lines", "United Airlines", "Southwest Airlines",
      "Alaska Airlines", "JetBlue Airways", "Spirit Airlines", "Frontier Airlines",
      "Hawaiian Airlines", "Allegiant Air", "Sun Country Airlines", "Breeze Airways",
      "Avelo Airlines", "Cape Air", "Contour Airlines", "Denver Air Connection",
      "Elite Airways", "Key Lime Air", "Mokulele Airlines", "Silver Airways",
      "Southern Airways Express"
    ]
  },
  iata_codes: {
    name: "IATA Airport Codes",
    icon: "\ud83c\udf9f\ufe0f",
    description: "Three-letter airport codes speed run",
    words: Object.keys(AIRPORTS || {})
  },
  routes: {
    name: "Popular Routes",
    icon: "\u2708\ufe0f",
    description: "Famous city pairs",
    words: [
      "JFK to LAX", "LHR to JFK", "SIN to LHR", "DXB to LHR",
      "LAX to NRT", "SFO to ICN", "JFK to CDG", "ORD to LHR",
      "ATL to MIA", "BOS to SFO", "DEN to SEA", "DFW to LAX",
      "HKG to SIN", "NRT to ICN", "BKK to SIN", "SYD to LAX",
      "FRA to JFK", "AMS to LHR", "CDG to FCO", "MAD to BCN",
      "MIA to GRU", "LAX to MEX", "JFK to DXB", "ICN to NRT",
      "LHR to SYD", "SIN to MEL", "DOH to LHR", "IST to LHR",
      "YYZ to LHR", "SEA to AKL", "DFW to NRT", "ATL to CDG",
      "MIA to BOG", "LAX to PVG", "ORD to FRA", "BOS to DUB",
      "SFO to HKG", "DEN to LHR", "PHX to LAX", "DTW to AMS"
    ]
  }
};

// Fix iata_codes in case AIRPORTS is already populated
if (CATEGORIES.iata_codes.words.length === 0) {
  CATEGORIES.iata_codes.words = Object.keys(AIRPORTS);
}

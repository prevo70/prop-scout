export type Property = {
  slug: string;
  address: string;
  suburb: string;
  building: string;
  architect: string;
  price: number;
  priceDisplay: string;
  priceVerified: boolean;
  priceSource?: string;
  type: string;
  beds: number;
  baths: number;
  cars: number;
  internalSqm: number;
  totalSqm: number;
  floor: number;
  daysOnMarket: number;
  medianDays: number;
  agent: string;
  agency: string;
  currentRentWeekly: number;
  leaseEnd: string;
  strataAnnual: number;
  councilAnnual: number;
  waterAnnual: number;
  heroImage: string;
  features: string[];
  // Acquisition
  stampDuty: number;
  totalAcquisition: number;
  deposit: number;
  loanAmount: number;
  totalCashRequired: number;
  // Rental
  ltrWeekly: number;
  ltrAnnual: number;
  ltrGrossYield: number;
  ltrNetYield: number;
  strNightly: number;
  strOccupancy: number;
  strAnnualRevenue: number;
  strGrossYield: number;
  strNetYield: number;
  recommendedStrategy: string;
  // Investment
  score: number;
  recommendation: string;
  riskRating: string;
  grossYield: number;
  netYield: number;
  capRate: number;
  cashOnCash: number;
  annualCashflow: number;
  annualHolding: number;
  annualInterest: number;
  interestRate: number;
  fiveYearCagr: number;
  fiveYearEquity: number;
  suburbMedian: number;
  priceToMedian: number;
  // Negotiation
  targetLow: number;
  targetHigh: number;
  openingOffer: number;
  walkAway: number;
  leveragePoints: { title: string; detail: string }[];
  // Comparables
  comparables: {
    address: string;
    price: number;
    date: string;
    sqm: number;
    priceSqm: number;
    beds: number;
    baths: number;
    cars: number;
    similarity: number;
  }[];
  // AI
  aiSummary: string;
};

export const properties: Property[] = [
  {
    slug: "3112-101-bathurst",
    address: "3112 / 101 Bathurst Street",
    suburb: "Sydney NSW 2000",
    building: "Lumiere",
    architect: "Foster & Partners",
    price: 1_350_000,
    priceDisplay: "$1,350,000",
    priceVerified: true,
    priceSource: "Listed price (Ayre Real Estate)",
    type: "Apartment",
    beds: 1, baths: 1, cars: 1,
    internalSqm: 63, totalSqm: 82,
    floor: 31,
    daysOnMarket: 141, medianDays: 73,
    agent: "Emma Vadas", agency: "Ayre Real Estate",
    currentRentWeekly: 1_050, leaseEnd: "Sep 2026",
    strataAnnual: 7_320, councilAnnual: 1_340, waterAnnual: 836,
    heroImage: "/hero.webp",
    features: ["Air Conditioning", "Built-in Robes", "Dishwasher", "Gym", "50m Pool & Spa", "Concierge", "Secure Parking", "Study Nook", "Theatrettes"],
    stampDuty: 57_305, totalAcquisition: 65_213, deposit: 270_000, loanAmount: 1_080_000, totalCashRequired: 335_213,
    ltrWeekly: 1_050, ltrAnnual: 54_600, ltrGrossYield: 4.04, ltrNetYield: 2.71,
    strNightly: 280, strOccupancy: 65, strAnnualRevenue: 66_430, strGrossYield: 4.92, strNetYield: 3.19,
    recommendedStrategy: "Long-Term Rental",
    score: 42, recommendation: "HOLD", riskRating: "MEDIUM",
    grossYield: 4.04, netYield: 2.71, capRate: 2.71, cashOnCash: -8.69,
    annualCashflow: -29_328, annualHolding: 15_937, annualInterest: 65_880, interestRate: 6.10,
    fiveYearCagr: 4.0, fiveYearEquity: 562_572, suburbMedian: 770_000, priceToMedian: 1.753,
    targetLow: 1_250_000, targetHigh: 1_300_000, openingOffer: 1_200_000, walkAway: 1_300_000,
    leveragePoints: [
      { title: "141 Days on Market", detail: "Nearly double the 73-day median. Vendor holding costs ~$6,500/month." },
      { title: "Domain Estimate: $1.3m", detail: "Asking is $50k above independent valuation." },
      { title: "Comp 3106 Sold for Less", detail: "Same building, 75sqm (larger) sold $1,320,000. Subject at $21,429/sqm vs $17,600/sqm." },
      { title: "Negative Cashflow", detail: "At asking: -$29,328/yr. Numbers don't work for investors at this price." },
      { title: "Agent Has Multiple Listings", detail: "3+ Lumiere units active. Needs to move stock." },
      { title: "Lease Limits Buyer Pool", detail: "Lease to Sep 2026 restricts to investors only." },
    ],
    comparables: [
      { address: "3106/101 Bathurst St", price: 1_320_000, date: "2 Mar 2026", sqm: 75, priceSqm: 17_600, beds: 1, baths: 1, cars: 1, similarity: 92 },
      { address: "1709/117 Bathurst St", price: 1_020_000, date: "27 Mar 2026", sqm: 68, priceSqm: 15_000, beds: 1, baths: 1, cars: 0, similarity: 75 },
      { address: "3111/117 Bathurst St", price: 1_050_000, date: "20 Feb 2026", sqm: 68, priceSqm: 15_441, beds: 1, baths: 1, cars: 0, similarity: 72 },
    ],
    aiSummary: "Level 31 Lumiere apartment by Foster & Partners. Premium building with resort amenities but asking price is stretched above Domain's $1.3m estimate and $17,600/sqm building average. Strong tenant at $1,050/wk but negatively geared at -$29k/yr. Quality asset — negotiate to $1.25\u20131.30m.",
  },
  {
    slug: "3806-117-bathurst",
    address: "3806 / 117 Bathurst Street",
    suburb: "Sydney NSW 2000",
    building: "Greenland Centre",
    architect: "BVN Architecture",
    price: 1_640_000,
    priceDisplay: "$1,640,000",
    priceVerified: true,
    priceSource: "Domain mid-estimate (Contact Agent listing)",
    type: "Apartment",
    beds: 2, baths: 2, cars: 0,
    internalSqm: 91, totalSqm: 91,
    floor: 38,
    daysOnMarket: 14, medianDays: 88,
    agent: "Emma Vadas & Leah Atley", agency: "Ayre Real Estate",
    currentRentWeekly: 1_465, leaseEnd: "N/A",
    strataAnnual: 10_544, councilAnnual: 468, waterAnnual: 852,
    heroImage: "/hero-3806-117-bathurst.webp",
    features: ["Floor-to-Ceiling Windows", "East-Facing Balcony", "Harbour Views", "Miele Appliances", "Ducted AC", "24/7 Concierge", "Lap Pool", "Gym", "Cinema Room", "Dry Sauna"],
    stampDuty: 73_255, totalAcquisition: 81_163, deposit: 328_000, loanAmount: 1_312_000, totalCashRequired: 409_163,
    ltrWeekly: 1_465, ltrAnnual: 76_180, ltrGrossYield: 4.65, ltrNetYield: 2.84,
    strNightly: 350, strOccupancy: 60, strAnnualRevenue: 76_650, strGrossYield: 4.67, strNetYield: 2.89,
    recommendedStrategy: "Long-Term Rental",
    score: 69, recommendation: "HOLD", riskRating: "MEDIUM",
    grossYield: 4.65, netYield: 2.84, capRate: 3.17, cashOnCash: -8.43,
    annualCashflow: -34_494, annualHolding: 18_697, annualInterest: 91_978, interestRate: 5.76,
    fiveYearCagr: 3.0, fiveYearEquity: 580_000, suburbMedian: 1_310_000, priceToMedian: 1.252,
    targetLow: 1_500_000, targetHigh: 1_550_000, openingOffer: 1_420_000, walkAway: 1_520_000,
    leveragePoints: [
      { title: "Owner Reselling at Same Price", detail: "Bought $1.63m in Mar 2023. Zero capital growth in 3 years." },
      { title: "25+ Units for Sale in Building", detail: "Massive oversupply. Multiple 'All Offers Considered' listings." },
      { title: "No Car Space", detail: "Significant penalty vs comps with parking. 3703 (2/2/1) sold $1.95m." },
      { title: "2606 Sold at $1.28m", detail: "Same config (2/2/0) on L26. Questions the floor premium at $1.64m." },
      { title: "44% Clearance Rate", detail: "Buyer's market. 88 median days on market for 2-beds." },
      { title: "Negative Growth Track Record", detail: "3703 showed -1.95% annual growth over 2 years." },
    ],
    comparables: [
      { address: "3703/117 Bathurst St", price: 1_950_000, date: "2026", sqm: 91, priceSqm: 21_429, beds: 2, baths: 2, cars: 1, similarity: 88 },
      { address: "2606/117 Bathurst St", price: 1_280_000, date: "2026", sqm: 91, priceSqm: 14_066, beds: 2, baths: 2, cars: 0, similarity: 92 },
      { address: "5808/117 Bathurst St", price: 2_280_000, date: "2026", sqm: 0, priceSqm: 0, beds: 2, baths: 2, cars: 1, similarity: 65 },
    ],
    aiSummary: "Level 38, 2-bed in Greenland Centre with harbour views. Domain values at $1.64m (mid). Strong rental at $1,465/wk (4.65% gross) but negatively geared at -$34.5k/yr. Building has 25+ units for sale creating oversupply. Previous owner saw zero growth since 2023. Negotiate hard — target $1.5m.",
  },
  {
    slug: "1702-115-bathurst",
    address: "1702 / 115 Bathurst Street",
    suburb: "Sydney NSW 2000",
    building: "Greenland Centre",
    architect: "BVN & Woods Bagot",
    price: 1_020_000,
    priceDisplay: "~$1,020,000",
    priceVerified: false,
    priceSource: "Comp-based estimate: 1709/117 Bathurst St sold $1,020,000 on 27 Mar 2026 (same complex, 1-bed+study, 1 bath, 0 cars, 68sqm, L17). Listing is Contact Agent — actual guide unverified.",
    type: "Apartment",
    beds: 1, baths: 1, cars: 0,
    internalSqm: 72, totalSqm: 72,
    floor: 17,
    daysOnMarket: 1, medianDays: 73,
    agent: "Charlie Grech & Jason Wang", agency: "Dentown - Sydney",
    currentRentWeekly: 1_175, leaseEnd: "N/A",
    strataAnnual: 4_704, councilAnnual: 680, waterAnnual: 732,
    heroImage: "/hero-1702-115-bathurst.jpg",
    features: ["North-Facing Balcony", "City Skyline Views", "Marble Benchtop", "Miele Appliances", "Gas Cooking", "Ducted AC", "Study Nook", "Internal Laundry", "NBN 2Gbps", "24/7 Concierge", "Lap Pool", "Gym"],
    // Stamp duty at $1,020,000: $10,530 + (($1,020,000 - $351,000) / 100 * $4.50) = $10,530 + $30,105 = $40,635
    stampDuty: 40_635, totalAcquisition: 48_543, deposit: 204_000, loanAmount: 816_000, totalCashRequired: 252_543,
    ltrWeekly: 1_175, ltrAnnual: 61_100, ltrGrossYield: 5.99, ltrNetYield: 4.50,
    strNightly: 250, strOccupancy: 60, strAnnualRevenue: 54_750, strGrossYield: 5.37, strNetYield: 3.38,
    recommendedStrategy: "Long-Term Rental",
    // Score recalculated at $1,020,000
    score: 56, recommendation: "HOLD", riskRating: "MEDIUM",
    grossYield: 5.99, netYield: 4.50, capRate: 4.50, cashOnCash: -1.55,
    annualCashflow: -3_924, annualHolding: 13_110, annualInterest: 49_776, interestRate: 6.10,
    fiveYearCagr: 4.0, fiveYearEquity: 425_000, suburbMedian: 770_000, priceToMedian: 1.325,
    targetLow: 920_000, targetHigh: 980_000, openingOffer: 900_000, walkAway: 1_020_000,
    leveragePoints: [
      { title: "Contact Agent — Price Unknown", detail: "No listed price. Comp 1709/117 Bathurst (same complex, same config, L17) sold $1,020,000 on 27 Mar 2026. Use as anchor." },
      { title: "Lower Floor Than Key Comps", detail: "L17 vs higher-floor premiums. 3806 (L38) in same complex listed significantly higher. Floor discount justified." },
      { title: "No Car Space", detail: "Reduces buyer pool and resale value. 101 Bathurst units with parking sell at 20%+ premium." },
      { title: "Building Oversupply", detail: "25+ units for sale across Greenland Centre complex. High supply = buyer leverage." },
      { title: "Strong Rental at $1,175/wk", detail: "Agent estimates $1,100-$1,250/wk. At $1,175/wk gross yield is 5.99% — above suburb median of ~4.3%." },
      { title: "Just Listed — Establish Floor", detail: "Fresh listing with 987 page views. First offer sets the tone. Go in early and firm." },
    ],
    comparables: [
      { address: "1709/117 Bathurst St", price: 1_020_000, date: "27 Mar 2026", sqm: 68, priceSqm: 15_000, beds: 1, baths: 1, cars: 0, similarity: 90 },
      { address: "608/83 Harbour St", price: 965_000, date: "29 Mar 2026", sqm: 0, priceSqm: 0, beds: 1, baths: 1, cars: 0, similarity: 75 },
      { address: "2804/1-5 Hosking Pl", price: 750_000, date: "27 Mar 2026", sqm: 0, priceSqm: 0, beds: 1, baths: 1, cars: 0, similarity: 70 },
    ],
    aiSummary: "Level 17, 1-bed+study (72sqm) in Greenland Centre. PRICE UNVERIFIED \u2014 listing is 'Contact Agent'. Comp-based estimate of $1,020,000 from 1709/117 Bathurst (same complex, same config, same floor, 68sqm, sold 27 Mar 2026). At that price: 5.99% gross yield on $1,175/wk rent, nearly break-even cashflow at -$3,924/yr. The 72sqm unit is 4sqm larger than the comp, which may justify a modest premium. Building has 25+ units for sale — oversupply favours buyers. Key action: contact agent to establish actual price guide before modelling further.",
  },
  {
    slug: "2502-393-pitt",
    address: "2502 / 393 Pitt Street",
    suburb: "Sydney NSW 2000",
    building: "Hordern Towers",
    architect: "Unknown",
    price: 775_000,
    priceDisplay: "$775,000",
    priceVerified: true,
    priceSource: "Listed price (Sydney Cove Property)",
    type: "Apartment",
    beds: 1, baths: 1, cars: 0,
    internalSqm: 61, totalSqm: 61,
    floor: 25,
    daysOnMarket: 14, medianDays: 73,
    agent: "Brenden Taliana", agency: "Sydney Cove Property",
    currentRentWeekly: 800, leaseEnd: "N/A",
    strataAnnual: 6_844, councilAnnual: 1_340, waterAnnual: 835,
    heroImage: "",
    features: ["Timber Flooring", "Ducted AC", "Bathtub", "Separate Laundry", "Balcony", "24hr Concierge", "Indoor Pool & Spa", "Gym", "Sauna", "Squash Court", "Gas Cooking", "Dishwasher"],
    stampDuty: 29_610, totalAcquisition: 37_518, deposit: 155_000, loanAmount: 620_000, totalCashRequired: 192_518,
    ltrWeekly: 800, ltrAnnual: 41_600, ltrGrossYield: 5.37, ltrNetYield: 4.20,
    strNightly: 220, strOccupancy: 55, strAnnualRevenue: 44_165, strGrossYield: 5.70, strNetYield: 3.50,
    recommendedStrategy: "Long-Term Rental",
    score: 55, recommendation: "HOLD", riskRating: "MEDIUM",
    grossYield: 5.37, netYield: 4.20, capRate: 4.20, cashOnCash: -2.72,
    annualCashflow: -5_239, annualHolding: 9_019, annualInterest: 37_820, interestRate: 6.10,
    fiveYearCagr: 4.0, fiveYearEquity: 323_000, suburbMedian: 770_000, priceToMedian: 1.006,
    targetLow: 700_000, targetHigh: 740_000, openingOffer: 680_000, walkAway: 760_000,
    leveragePoints: [
      { title: "No Car Space", detail: "Reduces buyer pool in CBD. Comparable units with parking command 15-20% premium." },
      { title: "Above World Square", detail: "Mixed-use tower above shopping centre — noise, foot traffic, and commercial strata complexity." },
      { title: "Low Strata at $1,711/q", detail: "Relatively low body corporate, but older building may face special levies for maintenance." },
      { title: "Below Suburb Median", detail: "At $775k, priced just at the $770k CBD median. Good entry point for the area." },
    ],
    comparables: [],
    aiSummary: "Level 25 Hordern Towers above World Square. Spacious 61sqm with timber floors, bathtub, separate laundry. Low strata at $1,711/q. Rental estimate $800/wk (5.37% gross). Negative cashflow at -$5.2k/yr with 80% LVR but nearly break-even. Below suburb median at $775k — solid CBD entry point. No car space limits resale pool.",
  },
  {
    slug: "1008-2-york",
    address: "1008 / 2 York Street",
    suburb: "Sydney NSW 2000",
    building: "Portico",
    architect: "Unknown (Historic Old Scots Church)",
    price: 985_000,
    priceDisplay: "$985,000",
    priceVerified: true,
    priceSource: "Listed price (Sydney Cove Property)",
    type: "Apartment",
    beds: 1, baths: 1, cars: 0,
    internalSqm: 89, totalSqm: 89,
    floor: 10,
    daysOnMarket: 30, medianDays: 73,
    agent: "Monique Lavers", agency: "Sydney Cove Property",
    currentRentWeekly: 750, leaseEnd: "N/A",
    strataAnnual: 5_000, councilAnnual: 1_200, waterAnnual: 700,
    heroImage: "",
    features: ["Dual-Level Layout", "Double-Vaulted Ceilings", "Floor-to-Ceiling Glass", "Polished Jarrah Floors", "Ducted AC", "Internal Laundry", "24hr Concierge", "Pet-Friendly", "Secure Lift Access", "Heritage Building"],
    stampDuty: 39_060, totalAcquisition: 46_968, deposit: 197_000, loanAmount: 788_000, totalCashRequired: 243_968,
    ltrWeekly: 750, ltrAnnual: 39_000, ltrGrossYield: 3.96, ltrNetYield: 3.26,
    strNightly: 280, strOccupancy: 55, strAnnualRevenue: 56_210, strGrossYield: 5.71, strNetYield: 3.50,
    recommendedStrategy: "Long-Term Rental",
    score: 51, recommendation: "HOLD", riskRating: "MEDIUM",
    grossYield: 3.96, netYield: 3.26, capRate: 3.26, cashOnCash: -6.54,
    annualCashflow: -15_968, annualHolding: 6_900, annualInterest: 48_068, interestRate: 6.10,
    fiveYearCagr: 4.0, fiveYearEquity: 410_000, suburbMedian: 770_000, priceToMedian: 1.279,
    targetLow: 880_000, targetHigh: 940_000, openingOffer: 860_000, walkAway: 960_000,
    leveragePoints: [
      { title: "Strata/Council/Water Unknown", detail: "Listing does not disclose levies. Request strata report before making offer — heritage buildings can have high special levies." },
      { title: "No Car Space", detail: "89sqm premium apartment without parking. Near Wynyard but limits resale to non-drivers." },
      { title: "Heritage Building Risk", detail: "Old Scots Church conversion. Heritage-listed buildings face restrictive renovation rules and potentially higher maintenance." },
      { title: "Low Gross Yield at 3.96%", detail: "Below Sydney CBD average of ~4.3%. Price needs to come down for investment metrics to work." },
      { title: "Large for 1-Bed (89sqm)", detail: "Dual-level layout is unique and premium, but niche buyer pool. Comparable 1-beds are 50-70sqm." },
    ],
    comparables: [],
    aiSummary: "Dual-level 89sqm in the historic Portico (Old Scots Church). Double-vaulted ceilings, jarrah floors, floor-to-ceiling glass. Premium fit-out but low yield at 3.96% gross. Strata/council not disclosed — request strata report. Heritage building adds character but maintenance risk. Near Wynyard, Barangaroo, The Rocks. At $985k, negotiate toward $900k to improve yield above 4.3%.",
  },
  {
    slug: "308-653-george",
    address: "308 / 653 George Street",
    suburb: "Sydney NSW 2000",
    building: "Mantra Sydney Central",
    architect: "Unknown",
    price: 639_000,
    priceDisplay: "$639,000",
    priceVerified: true,
    priceSource: "Listed price (Sydney Cove Property)",
    type: "Apartment",
    beds: 1, baths: 2, cars: 0,
    internalSqm: 0, totalSqm: 0,
    floor: 3,
    daysOnMarket: 21, medianDays: 73,
    agent: "Brenden Taliana", agency: "Sydney Cove Property",
    currentRentWeekly: 0, leaseEnd: "N/A",
    strataAnnual: 11_377, councilAnnual: 1_056, waterAnnual: 105,
    heroImage: "",
    features: ["Fully Furnished", "Two Bathrooms", "Two Balconies", "Ducted AC", "24hr Concierge (Mantra Lease)", "On-Site Restaurant", "Accor Group Managed", "STR-Only Investment"],
    stampDuty: 23_490, totalAcquisition: 31_398, deposit: 127_800, loanAmount: 511_200, totalCashRequired: 159_198,
    ltrWeekly: 0, ltrAnnual: 0, ltrGrossYield: 0, ltrNetYield: 0,
    strNightly: 240, strOccupancy: 75, strAnnualRevenue: 65_700, strGrossYield: 10.28, strNetYield: 4.89,
    recommendedStrategy: "Short-Term Rental",
    score: 54, recommendation: "HOLD", riskRating: "MEDIUM",
    grossYield: 4.89, netYield: 2.93, capRate: 2.93, cashOnCash: -7.83,
    annualCashflow: -12_467, annualHolding: 12_538, annualInterest: 31_183, interestRate: 6.10,
    fiveYearCagr: 4.0, fiveYearEquity: 266_000, suburbMedian: 770_000, priceToMedian: 0.830,
    targetLow: 570_000, targetHigh: 610_000, openingOffer: 550_000, walkAway: 625_000,
    leveragePoints: [
      { title: "Investment Only — Cannot Live In", detail: "Severely restricts buyer pool to investors only. No owner-occupier demand at resale." },
      { title: "Very High Strata ($2,844/q)", detail: "3-year strata loan period inflates levies to $11,377/yr. Verify post-loan reduction." },
      { title: "Hotel Management Dependency", detail: "Returns depend on Mantra/Accor occupancy and management. You don't control pricing or guest experience." },
      { title: "Floor Level 3", detail: "Low floor in a hotel building. No views, noise from ground level. Limited capital growth vs higher floors." },
      { title: "Sqm Not Disclosed", detail: "No internal area listed. Request floor plan measurements before modelling $/sqm." },
    ],
    comparables: [],
    aiSummary: "Mantra Sydney Central (Accor group). INVESTMENT ONLY — cannot be lived in. Sold fully furnished. Listed net STR return of $31,254/yr (4.8%) after elevated strata of $2,844/q (3-yr strata loan). At 80% LVR, still negatively geared at -$12.5k/yr. Lowest entry point at $639k (0.83× median) but restricted buyer pool limits exit options. Cash buyers see positive returns. Negotiate hard on strata loan timeline.",
  },
  {
    slug: "313-45-shelley",
    address: "313 / 45 Shelley Street",
    suburb: "Sydney NSW 2000",
    building: "King Street Wharf",
    architect: "Unknown",
    price: 760_000,
    priceDisplay: "$760,000",
    priceVerified: true,
    priceSource: "Listed price (Sydney Cove Property)",
    type: "Apartment",
    beds: 1, baths: 1, cars: 0,
    internalSqm: 0, totalSqm: 0,
    floor: 3,
    daysOnMarket: 30, medianDays: 73,
    agent: "Brenden Taliana", agency: "Sydney Cove Property",
    currentRentWeekly: 700, leaseEnd: "N/A",
    strataAnnual: 8_565, councilAnnual: 1_340, waterAnnual: 799,
    heroImage: "",
    features: ["Eastern Aspect", "Floor-to-Ceiling Windows", "Gas Cooking", "Large Separate Study", "Built-in Wardrobe", "Balcony Access", "Ducted AC", "Internal Laundry", "Video Intercom", "Secure Lift Access"],
    stampDuty: 28_935, totalAcquisition: 36_843, deposit: 152_000, loanAmount: 608_000, totalCashRequired: 188_843,
    ltrWeekly: 700, ltrAnnual: 36_400, ltrGrossYield: 4.79, ltrNetYield: 3.39,
    strNightly: 220, strOccupancy: 55, strAnnualRevenue: 44_165, strGrossYield: 5.81, strNetYield: 3.55,
    recommendedStrategy: "Long-Term Rental",
    score: 53, recommendation: "HOLD", riskRating: "MEDIUM",
    grossYield: 4.79, netYield: 3.39, capRate: 3.39, cashOnCash: -6.03,
    annualCashflow: -11_392, annualHolding: 10_704, annualInterest: 37_088, interestRate: 6.10,
    fiveYearCagr: 4.0, fiveYearEquity: 317_000, suburbMedian: 770_000, priceToMedian: 0.987,
    targetLow: 690_000, targetHigh: 730_000, openingOffer: 670_000, walkAway: 740_000,
    leveragePoints: [
      { title: "Floor Level 3 — Low Floor", detail: "Ground-level proximity in a waterfront precinct. Limited views, potential noise from restaurants/bars below." },
      { title: "No Car Space", detail: "King Street Wharf has limited parking. No space reduces resale appeal." },
      { title: "High Strata ($2,141/q)", detail: "$8,565/yr body corporate eats into yield. Waterfront buildings carry higher maintenance costs." },
      { title: "Sqm Not Disclosed", detail: "No internal area listed. 1-bed+study could be 55-70sqm — request measurements." },
      { title: "Below Suburb Median", detail: "At $760k, just under the $770k median. Reasonable entry point for waterfront CBD." },
    ],
    comparables: [],
    aiSummary: "1-bed+study in King Street Wharf. Eastern aspect, floor-to-ceiling windows, separate study. Prime waterfront location near Barangaroo and Darling Harbour. Rent estimate $700/wk (4.79% gross) but high strata at $8,565/yr drags net yield to 3.39%. Negatively geared at -$11.4k/yr. Low floor (L3) limits views and capital growth. Below median at $760k — target $700k to improve cashflow.",
  },
];

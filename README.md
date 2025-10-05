<div align="center">

<img src="public/ClimaLens.png" alt="ClimaLens Logo" width="200"/>

# ClimaLens

**Historical Climate Likelihood Analysis Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![NASA MERRA-2](https://img.shields.io/badge/NASA-MERRA--2-red)](https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/)
[![HYCOM](https://img.shields.io/badge/NOAA-HYCOM-blue)](https://www.hycom.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://climalens.vercel.app) • [Documentation](docs/) • [Report Issue](https://github.com/Panacea2005/ClimaLens/issues)

</div>

---

## Overview

ClimaLens is an advanced climate intelligence platform that analyzes **45 years of NASA MERRA-2 atmospheric data** and **32 years of NOAA HYCOM ocean data** to compute the historical likelihood of extreme weather conditions at any location and date worldwide.

The platform answers the question: **"How often has this location historically experienced extreme heat, cold, wind, rain, or uncomfortable conditions around this date?"**

### Key Distinction

**ClimaLens provides historical climatological analysis, not weather forecasts.** It uses day-of-year mapping and historical distributions to estimate the probability of extreme conditions based on past patterns—ideal for long-term planning, research, and understanding typical climate behavior.

---

## Features

### Core Capabilities

- **Global Coverage**: Interactive map with location search and browser geolocation
- **Flexible Date Selection**: Analyze any date from 1980 to 2100 using historical patterns
- **Multi-Variable Analysis**: Temperature, precipitation, wind speed, humidity, and heat index
- **Ocean Integration**: Sea surface temperature, salinity, and currents for coastal regions
- **Percentile-Based Thresholds**: Dynamic extreme weather detection using 90th/10th/95th percentiles
- **Temporal Weighting**: Recent years (2022-2024) weighted 1.5x for improved relevance
- **3-Tier Coastal Model**: Distance-based ocean influence (0-30km strong, 30-50km moderate, >50km none)

### User Experience

- **AI-Powered Insights**: Rule-based summaries combining weather and ocean data
- **Preset Locations**: Quick demos for Phoenix, Delhi, Paris, Hanoi, Sydney, and Manaus
- **Export & Share**: Download charts as PNG or share via URL with query parameters
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode**: System-aware theme with smooth transitions
- **Professional UI**: Built with shadcn/ui and Tailwind CSS

---

## How It Works

### Historical Climatology Methodology

ClimaLens does **not** predict future weather. Instead, it maps any selected date to its **day-of-year (DOY)** and analyzes historical patterns:

```
User Input: July 15, 2030 (Phoenix, AZ)
     ↓
DOY Extraction: Day 196 ± 7 days (189-203)
     ↓
Historical Query: All Day 189-203 periods from 1980-2024
     ↓
Analysis: 45 years × 15 days = 675 data points per variable
     ↓
Result: "Very Hot" probability = 67% (30/45 years exceeded 90th percentile)
```

### Data Sources

#### NASA MERRA-2 (Atmospheric Data)
- **Coverage**: 1980-present, global
- **Resolution**: ~50 km spatial, hourly temporal
- **Variables**: T2M (temperature), U10M/V10M (wind), QV2M (humidity), PRECTOT (precipitation)
- **Provider**: NASA Goddard Space Flight Center

#### NOAA HYCOM (Ocean Data)
- **Coverage**: 1992-present, global oceans
- **Resolution**: ~9 km spatial, daily temporal
- **Variables**: Sea surface temperature, salinity, water velocity (u/v components)
- **Provider**: NOAA / Naval Research Laboratory

### Analysis Pipeline

1. **Location Selection**: User clicks map or searches by name
2. **Date Selection**: Choose any date (past or future up to 2100)
3. **DOY Mapping**: Convert date to day-of-year with ±7 day window
4. **Data Fetching**: Query Google Earth Engine for MERRA-2 and HYCOM data
5. **Temporal Weighting**: Apply 1.5x weight to recent years (2022-2024)
6. **Percentile Calculation**: Compute thresholds dynamically per location
7. **Ocean Influence**: Apply coastal adjustments based on distance to sea
8. **Probability Computation**: Calculate likelihood of extreme conditions
9. **AI Insights**: Generate human-readable summary
10. **Visualization**: Display charts, probabilities, and metadata

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.2 (App Router, React Server Components)
- **Language**: TypeScript 5.0
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts
- **Maps**: Leaflet + react-leaflet
- **Icons**: Lucide React
- **Theme**: next-themes
- **Animations**: Framer Motion

### Backend
- **API Routes**: Next.js serverless functions
- **Data Platform**: Google Earth Engine API
- **Authentication**: GEE service account (JSON key)
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics

### Data Processing
- **MERRA-2 Access**: `@google/earthengine` Node.js client
- **HYCOM Access**: Google Earth Engine datasets
- **Geospatial**: Haversine distance calculations
- **Statistics**: Percentile computation, temporal weighting
- **Coastal Modeling**: 3-tier distance decay model

---

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Google Earth Engine service account with API access

### Installation

```bash
# Clone the repository
git clone https://github.com/Panacea2005/ClimaLens.git
cd ClimaLens

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Configuration

Create a `.env.local` file with the following variables:

```bash
# Google Earth Engine service account key path
GOOGLE_APPLICATION_CREDENTIALS=.secrets/climalens-gee-key.json

# Application URL (for share links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [ClimaLens_ALGORITHMS.md](ClimaLens_ALGORITHMS.md) | Complete algorithm specification and data sources |
| [CURRENT_IMPLEMENTATION.md](docs/CURRENT_IMPLEMENTATION.md) | Technical architecture and implementation details |
| [PERCENTILE_ALGORITHM.md](docs/PERCENTILE_ALGORITHM.md) | Percentile methodology and threshold computation |
| [HYCOM_IMPLEMENTATION_SUMMARY.md](docs/HYCOM_IMPLEMENTATION_SUMMARY.md) | Ocean data integration and coastal modeling |
| [FUTURE_DATES_FEATURE.md](docs/FUTURE_DATES_FEATURE.md) | Day-of-year mapping and future date handling |
| [FETCHING_REAL_DATA.md](docs/FETCHING_REAL_DATA.md) | Google Earth Engine setup and authentication |

---

## Use Cases

### Event Planning
Assess historical weather patterns for outdoor events, weddings, or conferences. Understand typical conditions for specific dates to make informed decisions.

### Construction & Infrastructure
Evaluate seasonal precipitation and temperature trends for project timelines. Plan around historically wet or extreme temperature periods.

### Agriculture & Farming
Analyze historical growing season conditions, frost dates, and precipitation patterns. Optimize planting schedules based on climatological data.

### Travel & Tourism
Research typical weather conditions for destination dates. Understand historical likelihood of rain, heat, or comfortable conditions.

### Climate Research & Education
Access processed NASA MERRA-2 and NOAA HYCOM data through an intuitive interface. Visualize long-term climate patterns and trends.

### Risk Assessment
Evaluate historical extreme weather frequency for insurance, real estate, or business continuity planning.

---

## Project Statistics

- **Total Lines of Code**: ~8,500 TypeScript/TSX
- **Components**: 40+ React components
- **API Routes**: 3 serverless functions
- **Documentation**: 3,000+ lines
- **Data Variables**: 5 atmospheric + 3 ocean variables
- **Historical Range**: 45 years (MERRA-2) + 32 years (HYCOM)
- **Analysis Time**: 1-3 minutes per location
- **Supported Locations**: Global coverage (land and coastal)

---

## Architecture Highlights

### Percentile-Based Thresholds
Dynamic extreme weather detection using location-specific historical distributions. Thresholds adapt to local climate, ensuring relevance across diverse regions.

### Temporal Weighting
Recent years (2022-2024) receive 1.5x weight in historical analysis, improving relevance for current climate patterns while maintaining long-term context.

### Coastal Influence Modeling
Three-tier distance-based model applies ocean data influence:
- **0-30 km**: 100% ocean influence
- **30-50 km**: Linear decay (100% → 0%)
- **>50 km**: No ocean influence

### Condition-Specific Ocean Adjustments
Ocean influence is applied differently based on physical principles:
- **Hot/Uncomfortable**: Direct adjustment (warmer sea → increased probability)
- **Cold**: Inverted adjustment (warmer sea → decreased probability)
- **Wet**: Positive boost based on absolute influence

---

## Data Citation

### NASA MERRA-2
> Global Modeling and Assimilation Office (GMAO) (2015), MERRA-2 tavg1_2d_slv_Nx: 2d,1-Hourly,Time-Averaged,Single-Level,Assimilation,Single-Level Diagnostics V5.12.4, Greenbelt, MD, USA, Goddard Earth Sciences Data and Information Services Center (GES DISC), Accessed: [2025], 10.5067/VJAFPLI1CSIV

### NOAA HYCOM
> HYCOM Consortium (2024), Hybrid Coordinate Ocean Model, Global Ocean Forecasting System 3.1, Naval Research Laboratory, Stennis Space Center, MS, USA

**Disclaimer**: NASA and NOAA do not endorse this application. ClimaLens is an independent project developed for educational and research purposes.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate documentation.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

### Data Providers
- NASA Goddard Space Flight Center (GSFC) Global Modeling and Assimilation Office (GMAO)
- NOAA / Naval Research Laboratory (NRL) HYCOM Consortium
- Google Earth Engine platform

### Technology Partners
- Vercel (hosting and deployment)
- shadcn/ui (component library)
- Radix UI (accessible primitives)
- Recharts (data visualization)
- Leaflet (mapping library)

### Team
ClimaLens was developed for the NASA Space Apps Challenge 2025 by a team passionate about making climate data accessible and actionable.

---

## Disclaimer

**ClimaLens provides historical climatological analysis, NOT weather forecasts.**

**What ClimaLens Does:**
- Analyzes 45 years of historical weather patterns
- Computes likelihood based on past observations
- Maps future dates to day-of-year for climatological context
- Useful for understanding typical conditions and long-term planning

**What ClimaLens Does NOT Do:**
- Predict specific future weather events
- Provide day-specific forecasts for the next 1-10 days
- Replace traditional weather forecasting services

**For short-range weather forecasts, please use:**
- NOAA National Weather Service
- Met Office
- Weather.com
- Local meteorological services

---

## Support

- **Issues**: [GitHub Issues](https://github.com/Panacea2005/ClimaLens/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Panacea2005/ClimaLens/discussions)
- **Documentation**: [docs/](docs/)

---

<div align="center">

**Built for NASA Space Apps Challenge 2025**

Made with precision and care by the ClimaLens Team

[Website](https://climalens.vercel.app) • [GitHub](https://github.com/Panacea2005/ClimaLens) • [Documentation](docs/)

</div>
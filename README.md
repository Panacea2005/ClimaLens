# 🌍 ClimaLens

**Historical Climate Likelihood Analysis Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![NASA MERRA-2](https://img.shields.io/badge/NASA-MERRA--2-red)](https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **ClimaLens** computes the historical likelihood of extreme weather conditions at any location and date using **45 years of NASA MERRA-2 satellite data (1980-present)**. It answers: *"How often has this location historically experienced extreme heat/cold/wind/rain around this date?"*

---

## ✨ Features

- 🗺️ **Interactive Map** – Click anywhere globally or search by location
- 📅 **Any Date (1980-2100)** – Historical climatology for past or future dates
- 🧪 **5 Climate Conditions** – Very Hot, Cold, Windy, Wet, Uncomfortable
- 📊 **Advanced Analytics** – Percentile-based thresholds with global fallbacks
- 🎯 **Preset Locations** – Quick demos for diverse climates
- 📍 **Auto-location** – Browser geolocation support
- 🧠 **AI Insights** – Rule-based summaries of analysis results
- 📤 **Export & Share** – PNG charts + shareable URLs
- 🌓 **Dark Mode** – System-aware theme toggle
- 📱 **Responsive** – Mobile, tablet, desktop optimized

---

## 🔬 How It Works

### Historical Climatology (Not a Forecast!)

**ClimaLens does NOT predict future weather.** Instead, it uses **historical patterns** to estimate likelihood:

```
User selects: July 15, 2030 (future date)
       ↓
ClimaLens extracts: Day-of-year 196 (±7 days = 189-203)
       ↓
Query: All Day 189-203 periods across 1980-2024 (45 years)
       ↓
Result: "Very Hot" probability = 42% (19 out of 45 years exceeded threshold)
```

**Key Concept:** Future dates use the same analysis as past dates—mapping to **day-of-year** and computing historical frequencies. This is **climatology** (long-term patterns), not **forecasting** (next 10 days).

### Data & Methodology

- **Source**: NASA MERRA-2 reanalysis (state-of-the-art satellite + model data)
- **Resolution**: ~50 km spatial, hourly temporal
- **Variables**: 5 core variables (T2M, U10M, V10M, QV2M, PRECTOT)
- **Thresholds**: Percentile-based (90th/10th/95th) with scientific fallbacks
- **Analysis**: 675+ data points per variable per location

See [`ClimaLens_ALGORITHMS.md`](ClimaLens_ALGORITHMS.md) for full specification.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Google Earth Engine** service account (for data access)

### Installation

```bash
# Clone repository
git clone https://github.com/Panacea2005/ClimaLens.git
cd ClimaLens

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Google Earth Engine credentials path to .env.local
```

### Environment Variables

```bash
# .env.local
GOOGLE_APPLICATION_CREDENTIALS=.secrets/climalens-gee-key.json
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`ClimaLens_ALGORITHMS.md`](ClimaLens_ALGORITHMS.md) | Algorithm specification & data sources |
| [`docs/CURRENT_IMPLEMENTATION.md`](docs/CURRENT_IMPLEMENTATION.md) | Technical architecture (700+ lines) |
| [`docs/PERCENTILE_ALGORITHM.md`](docs/PERCENTILE_ALGORITHM.md) | Percentile methodology details |
| [`docs/NEW_FEATURES_v1.1.md`](docs/NEW_FEATURES_v1.1.md) | v1.1 features (geolocation, insights, export) |
| [`docs/FETCHING_REAL_DATA.md`](docs/FETCHING_REAL_DATA.md) | Google Earth Engine setup guide |

---

## 🧪 Testing

```bash
# Run unit tests (DOY utilities)
npm test

# Test Google Earth Engine authentication
# Visit: http://localhost:3000/test-merra
```

---

## 🎯 Use Cases

- 📅 **Event Planning** – Check historical climate for outdoor events
- 🏗️ **Construction** – Assess weather patterns for project timelines
- 🌾 **Agriculture** – Understand seasonal precipitation/temperature trends
- ✈️ **Travel** – Research typical conditions for destination dates
- 📊 **Research** – Access processed NASA MERRA-2 data via UI
- 🏛️ **Climate Education** – Visualize historical climate patterns

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet + react-leaflet
- **Icons**: Lucide React
- **Theme**: next-themes

### Backend
- **API**: Next.js API Routes (serverless)
- **Data**: Google Earth Engine (GEE) API
- **Auth**: GEE service account
- **Deployment**: Vercel

---

## 📊 Project Statistics

- **Lines of Code**: ~5,000 TypeScript
- **Components**: 30+ shadcn/ui
- **API Routes**: 3 (analyze-weather, merra-data, test-merra)
- **Documentation**: 2,500+ lines
- **Variables**: 5 out of 97 MERRA-2 variables
- **Analysis Time**: 20-40 seconds (45 years of data)
- **Bundle Size**: ~350 KB

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the **MIT License** – see [`LICENSE`](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Data**: NASA Goddard Space Flight Center (GSFC) Global Modeling and Assimilation Office (GMAO)
- **Platform**: Google Earth Engine
- **Hosting**: Vercel
- **UI**: shadcn/ui
- **Team**: ClimaLens @ NASA Space Apps Challenge 2025

### Data Citation

> Global Modeling and Assimilation Office (GMAO) (2015), MERRA-2 tavg1_2d_slv_Nx: 2d,1-Hourly,Time-Averaged,Single-Level,Assimilation,Single-Level Diagnostics V5.12.4, Greenbelt, MD, USA, Goddard Earth Sciences Data and Information Services Center (GES DISC), Accessed: [2025], 10.5067/VJAFPLI1CSIV

**NASA does not endorse this application.**

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Panacea2005/ClimaLens/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Panacea2005/ClimaLens/discussions)
- **Email**: [Contact via GitHub](https://github.com/Panacea2005)

---

## 🔮 Roadmap

### v1.2 (Q1 2026)
- [ ] User authentication (Clerk/NextAuth)
- [ ] Saved locations & analysis history
- [ ] Multi-year trend analysis
- [ ] PDF report export
- [ ] Unit conversion system (imperial/metric)

### v2.0 (Q2 2026) - Ocean Data Integration
- [ ] **HYCOM Ocean Data**: Sea surface temperature, salinity, currents
- [ ] **Coastal Enhancement**: Improved accuracy for coastal regions (±15%)
- [ ] **SST Heatmap**: Ocean temperature overlay on map
- [ ] **Current Vectors**: Visualize ocean current direction/speed
- [ ] Vercel KV integration (cross-device sync)
- [ ] Mobile app (React Native)
- [ ] API for external integrations
- [ ] Custom threshold configuration
- [ ] Multi-language support

**See**: [`docs/HYCOM_ROADMAP.md`](docs/HYCOM_ROADMAP.md) for detailed ocean integration plan

---

## ⚠️ Disclaimer

**ClimaLens provides historical climatological analysis, NOT weather forecasts.**

- ✅ Shows historical likelihood based on 45 years of data
- ✅ Useful for understanding typical conditions
- ❌ Does NOT predict specific future weather events
- ❌ NOT a replacement for short-range weather forecasts

**For day-specific forecasts (next 1-10 days), use traditional weather services (NOAA, Met Office, etc.)**

---

<div align="center">

**Built with ❤️ for NASA Space Apps Challenge 2025**

[Live Demo](https://climalens.vercel.app) · [Documentation](docs/) · [Report Bug](https://github.com/Panacea2005/ClimaLens/issues)

</div>

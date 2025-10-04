# 🌍 ClimaLens Data & Algorithm Specification

## Overview
ClimaLens analyzes **NASA MERRA-2** reanalysis data to estimate the **likelihood** of extreme or uncomfortable weather conditions at any global location and date of the year.  
We use two NASA datasets accessed via **Google Earth Engine (GEE)**:

| Dataset | Description | Key Variables Used |
|----------|--------------|--------------------|
| **M2T1NXSLV – Single-Level Diagnostics** | Surface-level atmospheric conditions | `T2M`, `U10M`, `V10M`, `QV2M`, `TS` |
| **M2T1NXFLX – Surface Flux Diagnostics** | Precipitation, moisture and flux variables | `PRECTOT`, `EVAP`, `HFLUX`, `EFLUX` |

Pixel size: 55–70 km  
Temporal resolution: hourly (aggregated to daily means)  
Historical span: 1980 → present  

---

## 🎯 Analysis Goal
Given a **location** and **date**, ClimaLens computes the **historical probability** of experiencing:
1. Very Hot  
2. Very Cold  
3. Very Windy  
4. Very Wet  
5. Very Uncomfortable  

All five probabilities are returned automatically — users do not manually select them.

---

## 🧩 Relevant Variables

| Condition | Dataset | Variables | Description |
|------------|----------|------------|-------------|
| **Very Hot** | SLV | `T2M` (2-m air temp) | Surface temperature in Kelvin |
| **Very Cold** | SLV | `T2M`, `T10M` | Cold extremes near surface |
| **Very Windy** | SLV + FLX | `U10M`, `V10M`, `SPEED` | 10-m wind components / speed |
| **Very Wet** | FLX | `PRECTOT` | Total precipitation (kg/m²/s → mm/day) |
| **Very Uncomfortable** | SLV + FLX | `T2M`, `QV2M`, `PRECTOT` | Heat + humidity combination |

---

## 🧮 Core Algorithms

### 1. Daily Aggregation
Aggregate hourly data for each variable within ±7 days of the selected **day-of-year** to compute daily means per year.
```js
daily_mean = mean(values within day_of_year ±7)
```

### 2. Exceedance Probability
Compute how often the variable exceeds a fixed or percentile threshold across all available years.
```js
P(x ≥ threshold) = count(days exceeding) / total_days
```

### 3. Derived Metrics
| Condition | Formula / Rule | Threshold |
|------------|----------------|------------|
| **Very Hot** | `T2M ≥ 308 K` | 35°C |
| **Very Cold** | `T2M ≤ 273 K` | 0°C |
| **Very Windy** | `sqrt(U10M² + V10M²) ≥ 10 m/s` | Gale-level wind |
| **Very Wet** | `PRECTOT × 86400 ≥ 10 mm/day` | Rainy day |
| **Very Uncomfortable** | `(T2M > 303 K) AND (QV2M > 0.018)` | Hot and humid |

All conditions are evaluated automatically for the given `(lat, lon, dayOfYear)`.

### 4. Optional Enhancements
- **Adaptive percentile thresholds:** e.g., top 10% hottest / wettest for local calibration.  
- **Heat Index / Humidex:**  
  \[
  HI = T - 0.55(1 - RH)(T - 14.5)
  \]
- **Trend estimation:** Linear regression of annual means → long-term change indicator.

---

## 📊 Example Output
```json
{
  "query": { "lat": 21.03, "lon": 105.85, "day": 172 },
  "probabilities": {
    "hot": 0.42,
    "cold": 0.00,
    "windy": 0.12,
    "wet": 0.31,
    "uncomfortable": 0.18
  },
  "metadata": {
    "datasets": {
      "slv": "NASA/GSFC/MERRA/slv/2",
      "flx": "NASA/GSFC/MERRA/flx/2"
    },
    "window_days": 7,
    "years_used": 40,
    "units": {
      "T2M": "K",
      "U10M": "m/s",
      "V10M": "m/s",
      "PRECTOT": "mm/day",
      "QV2M": "kg/kg"
    },
    "thresholds": {
      "hot": "T2M ≥ 308 K",
      "cold": "T2M ≤ 273 K",
      "windy": "√(U10M² + V10M²) ≥ 10 m/s",
      "wet": "PRECTOT ≥ 10 mm/day",
      "uncomfortable": "T2M > 303 K & QV2M > 0.018"
    }
  }
}
```

---

## ⚙️ Implementation Pipeline

| Stage | Operation | Performed In |
|--------|------------|--------------|
| **Client (Explore Tab)** | User selects location + date → API request | Next.js + React |
| **Server (API Route)** | Fetch MERRA-2 data via Google Earth Engine | Node / Serverless |
| **Computation** | Apply filters, reduceRegion mean, compute exceedance probabilities | GEE Reducers |
| **Frontend (Results Tab)** | Render cards, chart, summary | React + Recharts |
| **Optional Cache** | Store computed results for reuse | Supabase / localStorage |

---

## 🛰️ Data Attribution
> This project uses data from the **NASA Goddard Space Flight Center (GSFC)** Global Modeling and Assimilation Office (GMAO), distributed via the **NASA GES DISC**, and accessed through the **Google Earth Engine** platform.  
> Datasets:  
> - `NASA/GSFC/MERRA/slv/2` (Single-Level Diagnostics)  
> - `NASA/GSFC/MERRA/flx/2` (Surface Flux Diagnostics)

NASA does not endorse this application.

---

## ✅ Summary
ClimaLens applies simple, explainable, and scientifically grounded algorithms to transform NASA MERRA-2 reanalysis data into human-readable weather likelihoods.  
Its pipeline focuses on:
- **Transparency** — explainable thresholds  
- **Efficiency** — fast regional queries  
- **Accessibility** — clean visual presentation

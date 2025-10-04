# ClimaLens Dashboard Guide

## Overview

The ClimaLens dashboard is a comprehensive weather probability analysis tool that uses NASA MERRA-2 datasets to calculate the likelihood of extreme weather conditions based on 40+ years of historical data.

## Dashboard Structure

The dashboard consists of three main tabs:

### 1. 🌍 Explore Tab (`/dashboard/explore`)

**Purpose**: Input and configuration interface where users define their weather query.

**Features**:
- **Location Selection**
  - Search functionality for cities and locations
  - Interactive map for pinpoint selection
  - Displays selected coordinates (latitude/longitude)
  
- **Date Picker**
  - Calendar interface for target date selection
  - Allows users to select any future date for analysis
  
- **Weather Conditions Toggle**
  - 🔥 **Very Hot**: Top 10% of historical temperatures
  - ❄️ **Very Cold**: Bottom 10% of historical temperatures
  - 💨 **Very Windy**: Top 10% of historical wind speeds
  - 🌧️ **Very Wet**: Top 10% of historical precipitation
  - 😓 **Very Uncomfortable**: High heat index (temperature + humidity)
  
- **Map Preview**
  - Visual representation of selected location
  
- **Run Analysis Button**
  - Triggers the weather probability calculation
  - Shows loading state during processing

**Data Sources Displayed**:
- NASA MERRA-2 M2T1NXSLV (Single-Level Diagnostics)
- NASA MERRA-2 M2T1NXFLX (Surface Flux Diagnostics)

### 2. 📊 Results Tab (`/dashboard/results`)

**Purpose**: Display computed probabilities and analysis results.

**Features**:
- **Analysis Summary Card**
  - Number of conditions analyzed
  - Location coordinates
  - Target date in readable format
  - Years of historical data used
  
- **Probability Visualizations**
  - Individual cards for each weather condition
  - Progress bars showing probability percentages
  - Threshold values with units
  - Descriptive explanations for each result
  
- **Regional Probability Map**
  - Placeholder for interactive map overlay
  - Will show spatial distribution of probabilities
  
- **Export Functionality**
  - Export as CSV: Tabular data format
  - Export as JSON: Structured data format
  - Downloads include all analysis results
  
- **Methodology Link**
  - Quick access to Data & Methods tab

### 3. 🧪 Data & Methods Tab (`/dashboard/data-methods`)

**Purpose**: Transparency and documentation about data sources and methodology.

**Features**:
- **Important Disclaimer**
  - NASA non-endorsement notice
  - Warning about critical decision-making
  
- **NASA MERRA-2 Dataset Information**
  - Dataset descriptions (M2T1NXSLV and M2T1NXFLX)
  - Variables used with codes and units
  - Spatial resolution (0.5° x 0.625°)
  - Temporal resolution (Hourly)
  - Link to official NASA documentation
  
- **Scientific Methodology (Accordion)**
  - Percentile-Based Thresholds
  - Heat Index Calculation
  - Probability Calculation
  - Spatial Analysis
  
- **Example Calculation**
  - Step-by-step walkthrough
  - Real-world example (Cairo, Egypt)
  - Shows how thresholds are calculated
  
- **Technical Implementation**
  - Data processing details
  - Visualization approach
  
- **Limitations & Considerations**
  - Climate change trends
  - Reanalysis data limitations
  - Spatial resolution constraints
  - Microclimate variations

## API Endpoint

### POST `/api/analyze-weather`

**Purpose**: Process weather analysis requests and return probability calculations.

**Request Body**:
```json
{
  "lat": 39.91,
  "lon": -95.62,
  "date": "2024-07-15",
  "conditions": {
    "hot": true,
    "cold": true,
    "windy": false,
    "wet": true,
    "uncomfortable": false
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "location": {
      "lat": 39.91,
      "lon": -95.62,
      "name": "Kansas City, USA"
    },
    "date": "2024-07-15",
    "timestamp": "2024-10-04T12:00:00Z",
    "conditions": {
      "hot": {
        "enabled": true,
        "threshold": 35.2,
        "unit": "°C",
        "probability": 12.5,
        "description": "...",
        "historicalData": {
          "min": 15,
          "max": 45,
          "mean": 28,
          "p90": 35.2
        }
      }
    }
  },
  "message": "Analysis completed successfully"
}
```

**Current Status**: Returns mock data. In production, will connect to Google Earth Engine API.

## Data Flow

```
User Input (Explore Tab)
    ↓
POST /api/analyze-weather
    ↓
[Future: Google Earth Engine API]
    ↓
Calculate Percentiles & Probabilities
    ↓
Return Results
    ↓
Display on Results Tab
```

## Scientific Methodology

### Percentile-Based Thresholds

Instead of static global thresholds, ClimaLens uses **dynamic, location-specific thresholds** based on historical data:

1. **Collect Historical Data**: Gather all observations for the target date from 1980-present
2. **Calculate Percentiles**: Find the 90th percentile (for "very hot/windy/wet") or 10th percentile (for "very cold")
3. **Set Threshold**: This percentile value becomes the threshold
4. **Calculate Probability**: Count exceedances and divide by total observations

### Example: "Very Hot" in Cairo

1. Collect all July 15th temperatures from 1980-2024
2. Calculate 90th percentile → 42°C
3. Threshold: "Very Hot" = temperatures > 42°C
4. Probability: ~10% (by definition of 90th percentile)

### Advantages

- ✅ **Locally Relevant**: Thresholds adapt to local climate
- ✅ **Scientifically Robust**: Based on actual historical data
- ✅ **Meaningful Probabilities**: Accounts for regional variations
- ✅ **Personalized**: Different thresholds for different locations

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui components, Tailwind CSS
- **Data**: NASA MERRA-2 (via Google Earth Engine in production)
- **Charts**: Recharts
- **Date Handling**: date-fns

## Next Steps for Production

To implement real data fetching:

1. **Set up Google Earth Engine**
   - Create Google Cloud Project
   - Enable Earth Engine API
   - Create service account with credentials

2. **Install Earth Engine SDK**
   ```bash
   npm install @google/earthengine
   ```

3. **Update API Endpoint**
   - Replace mock data with actual GEE queries
   - Implement percentile calculations in GEE
   - Add error handling and rate limiting

4. **Add Map Integration**
   - Integrate Leaflet or Mapbox
   - Add location search with geocoding
   - Implement interactive map selection

5. **Enhance Results Visualization**
   - Add actual charts using Recharts
   - Implement dynamic map overlays
   - Add historical trend graphs

6. **Implement Caching**
   - Cache historical data calculations
   - Use Redis or similar for performance
   - Implement request deduplication

## File Structure

```
app/
├── dashboard/
│   ├── layout.tsx              # Dashboard layout with tabs
│   ├── page.tsx                # Redirects to /explore
│   ├── explore/
│   │   └── page.tsx            # Explore tab
│   ├── results/
│   │   └── page.tsx            # Results tab
│   └── data-methods/
│       └── page.tsx            # Data & Methods tab
├── api/
│   └── analyze-weather/
│       └── route.ts            # Weather analysis API endpoint
docs/
├── DASHBOARD_GUIDE.md          # This file
└── MERRA2_INTEGRATION.md       # MERRA-2 integration guide
```

## Usage

1. Navigate to `/dashboard` or `/dashboard/explore`
2. Select a location by searching or clicking the map
3. Choose a target date
4. Toggle desired weather conditions
5. Click "Run Analysis"
6. View results in the Results tab
7. Export data if needed
8. Learn more in Data & Methods tab

## Notes

- Current implementation uses **mock data** for demonstration
- Real implementation requires Google Earth Engine setup
- Historical data spans 1980 to present (~40+ years)
- All probabilities are based on historical frequencies
- Results should not be used for critical decision-making

## Support

For questions or issues, refer to:
- [NASA MERRA-2 Documentation](https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/)
- [Google Earth Engine Documentation](https://developers.google.com/earth-engine)
- Project README.md


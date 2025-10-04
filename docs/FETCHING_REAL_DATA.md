# Fetching REAL MERRA-2 Data

## Overview

To fetch REAL MERRA-2 data (not mock/sample data), you have **3 main options**:

1. **Google Earth Engine (GEE)** - Recommended for this project
2. **NASA OpenDAP** - Direct data access
3. **NASA Earthdata API** - REST API access

---

## ✅ Option 1: Google Earth Engine (RECOMMENDED)

This is the method used in your example JavaScript code.

### Your Example Code (JavaScript):
```javascript
var dataset = ee.ImageCollection('NASA/GSFC/MERRA/slv/2')
  .filter(ee.Filter.date('2022-02-01', '2022-02-02'));
var surface_pressure = dataset.select('PS');
var surface_pressure_vis = {
  min: 81100,
  max: 117000,
  palette: ['001137', '01abab', 'e7eb05', '620500']
};
Map.setCenter(-95.62, 39.91, 2);
Map.addLayer(surface_pressure, surface_pressure_vis);
```

### Setup Steps:

#### 1. Create Google Cloud Project
```bash
# Go to https://console.cloud.google.com
# Click "New Project"
# Name: "ClimaLens-NASA"
```

#### 2. Enable Earth Engine API
```bash
# In Google Cloud Console:
# APIs & Services > Library
# Search "Earth Engine API"
# Click Enable
```

#### 3. Create Service Account
```bash
# IAM & Admin > Service Accounts
# Create Service Account
# Name: "climalens-ee-service"
# Grant role: "Earth Engine Resource Writer"
# Create Key > JSON > Download
```

#### 4. Register for Earth Engine
```bash
# Visit: https://signup.earthengine.google.com/
# Sign up with your Google account
# Wait for approval (usually instant for educational use)
```

#### 5. Set Environment Variable
```bash
# Create .env.local file:
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-service-account-key.json
EE_PROJECT_ID=your-project-id
```

#### 6. Install Package (Already Done!)
```bash
npm install @google/earthengine --legacy-peer-deps
```

### Implementation for Next.js API Route:

```typescript
// app/api/fetch-real-merra/route.ts
import { NextRequest, NextResponse } from 'next/server'
import ee from '@google/earthengine'

// Initialize Earth Engine
const initializeEE = () => {
  return new Promise((resolve, reject) => {
    const privateKey = JSON.parse(process.env.EE_PRIVATE_KEY!)
    
    ee.data.authenticateViaPrivateKey(
      privateKey,
      () => {
        ee.initialize(
          null,
          null,
          () => resolve(true),
          (error: Error) => reject(error)
        )
      },
      (error: Error) => reject(error)
    )
  })
}

export async function POST(request: NextRequest) {
  try {
    const { lat, lon, startDate, endDate, variable } = await request.json()
    
    // Initialize EE
    await initializeEE()
    
    // Your exact code translated to Node.js:
    const dataset = ee.ImageCollection('NASA/GSFC/MERRA/slv/2')
      .filter(ee.Filter.date(startDate || '2022-02-01', endDate || '2022-02-02'))
    
    const surfacePressure = dataset.select(variable || 'PS')
    
    // Get values at a specific point
    const point = ee.Geometry.Point([lon || -95.62, lat || 39.91])
    
    // Extract values
    const values = await new Promise((resolve, reject) => {
      surfacePressure.getRegion(point, 500).evaluate(
        (result: any) => resolve(result),
        (error: Error) => reject(error)
      )
    })
    
    return NextResponse.json({
      success: true,
      source: 'Google Earth Engine',
      dataset: 'NASA/GSFC/MERRA/slv/2',
      location: { lat, lon },
      dateRange: { start: startDate, end: endDate },
      data: values
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
```

---

## 📡 Option 2: NASA OpenDAP

Direct access to MERRA-2 NetCDF files.

### Setup:

#### 1. Register for NASA Earthdata
```bash
# Visit: https://urs.earthdata.nasa.gov/users/new
# Create account
# Save username and password
```

#### 2. Set Credentials
```bash
# .env.local
NASA_EARTHDATA_USERNAME=your-username
NASA_EARTHDATA_PASSWORD=your-password
```

### OpenDAP URLs:

**Single-Level Diagnostics (M2T1NXSLV):**
```
https://goldsmr4.gesdisc.eosdis.nasa.gov/opendap/MERRA2/M2T1NXSLV.5.12.4/YEAR/MONTH/MERRA2_400.tavg1_2d_slv_Nx.YYYYMMDD.nc4
```

**Surface Flux (M2T1NXFLX):**
```
https://goldsmr4.gesdisc.eosdis.nasa.gov/opendap/MERRA2/M2T1NXFLX.5.12.4/YEAR/MONTH/MERRA2_400.tavg1_2d_flx_Nx.YYYYMMDD.nc4
```

### Python Example (if you want to use Python backend):

```python
import netCDF4 as nc
import requests
from requests.auth import HTTPBasicAuth

url = 'https://goldsmr4.gesdisc.eosdis.nasa.gov/opendap/MERRA2/M2T1NXSLV.5.12.4/2022/02/MERRA2_400.tavg1_2d_slv_Nx.20220201.nc4'

# Authenticate
session = requests.Session()
session.auth = (username, password)

# Open dataset
dataset = nc.Dataset(url)

# Read variables
temp = dataset.variables['T2M'][0, :, :]  # [time, lat, lon]
lat_vals = dataset.variables['lat'][:]
lon_vals = dataset.variables['lon'][:]

# Find nearest grid point
lat_idx = find_nearest(lat_vals, 39.91)
lon_idx = find_nearest(lon_vals, -95.62)

# Get value
temperature = temp[lat_idx, lon_idx]
```

---

## 🌐 Option 3: NASA Earthdata API

REST API access to MERRA-2 data.

### Endpoints:

**Search for datasets:**
```
https://cmr.earthdata.nasa.gov/search/granules.json?short_name=M2T1NXSLV&temporal=2022-02-01T00:00:00Z,2022-02-02T23:59:59Z
```

**Download data:**
Requires authentication and downloading NetCDF files.

---

## 🎯 Which Option to Use?

### Use **Google Earth Engine** if:
- ✅ You want server-side processing (no data download)
- ✅ You need fast statistical calculations
- ✅ You want to calculate percentiles from 40+ years of data
- ✅ You're okay with GCP setup
- ⭐ **RECOMMENDED for ClimaLens project**

### Use **OpenDAP** if:
- You want direct data access
- You're comfortable with NetCDF format
- You need specific hourly values
- You have Python backend

### Use **Earthdata API** if:
- You need to download full files
- You want batch processing
- You need offline access

---

## 🚀 Quick Start for ClimaLens

To get REAL data working in ClimaLens right now:

1. **Complete GEE Setup** (15 minutes)
   - Create GCP project
   - Enable EE API
   - Create service account
   - Download JSON key
   - Register for EE

2. **Add to .env.local:**
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
   EE_PROJECT_ID=your-project-id
   ```

3. **Create Real Data API Route** (use the code above)

4. **Update Dashboard** to call `/api/fetch-real-merra`

5. **Test** with `/test-merra` page

---

## 📊 Data Structure You'll Get

### From Google Earth Engine:
```javascript
{
  "type": "List",
  "columns": {
    "longitude": 0,
    "latitude": 1,
    "time": 2,
    "PS": 3  // Your selected variable
  },
  "data": [
    [-95.625, 39.5, 1643673600000, 101325.5],
    [-95.625, 39.5, 1643677200000, 101320.3],
    // ... more timesteps
  ]
}
```

### Variables Available:

**M2T1NXSLV:**
- T2M: Temperature at 2m (K)
- QV2M: Specific humidity at 2m (kg/kg)
- U10M: Eastward wind at 10m (m/s)
- V10M: Northward wind at 10m (m/s)
- PS: Surface pressure (Pa)

**M2T1NXFLX:**
- PRECTOT: Total precipitation (mm/day)
- PRECSNO: Snowfall (mm/day)
- EVAP: Evaporation (mm/day)

---

## 🔗 Useful Links

- [GEE MERRA-2 SLV Dataset](https://developers.google.com/earth-engine/datasets/catalog/NASA_GSFC_MERRA_slv_2)
- [GEE MERRA-2 FLX Dataset](https://developers.google.com/earth-engine/datasets/catalog/NASA_GSFC_MERRA_flx_2)
- [MERRA-2 Project Page](https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/)
- [NASA GES DISC](https://disc.gsfc.nasa.gov/)
- [Earthdata Login](https://urs.earthdata.nasa.gov/)

---

## ⚠️ Important Notes

1. **Authentication is REQUIRED** for all real data access
2. **Rate limits** apply to API requests
3. **Data processing** can take time for large queries
4. **Coordinates** are snapped to grid cells (0.5° × 0.625°)
5. **Time** is in UTC

---

## 🆘 Troubleshooting

### "Authentication failed"
- Check your service account key is valid
- Verify EE_PROJECT_ID is correct
- Ensure Earth Engine API is enabled

### "Dataset not found"
- Verify dataset name: `NASA/GSFC/MERRA/slv/2`
- Check date range is valid (1980-present)
- Ensure you're registered for Earth Engine

### "Computation timed out"
- Reduce date range
- Limit spatial extent
- Use `.limit()` to cap results

---

Need help? Check `/test-merra` for dataset information!


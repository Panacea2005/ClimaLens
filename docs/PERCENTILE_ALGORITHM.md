# 🌍 Percentile-Based Climate Analysis Algorithm

## 📋 Overview

**Problem with Fixed Thresholds**: Using absolute values like "35°C = hot" only works in temperate regions. In tropical areas, 35°C might be normal, while in polar regions, 10°C is extremely hot!

**Solution**: **Percentile-based thresholds** that adapt to each location's unique climate characteristics.

---

## 🎯 Core Principle

> **"Very Hot" means the TOP 10% of temperatures historically observed at THAT SPECIFIC LOCATION for that time of year.**

This approach is **globally robust** and makes sense everywhere:
- 🏜️ **Phoenix, Arizona**: "Very Hot" = 45°C (113°F)
- 🌴 **Singapore**: "Very Hot" = 34°C (93°F) 
- ❄️ **Reykjavik, Iceland**: "Very Hot" = 20°C (68°F)
- 🏔️ **Siberia**: "Very Hot" = 25°C (77°F)

All are correct because they're relative to each location's climate!

---

## 🧮 Algorithm Details

### 1. Very Hot (90th Percentile)

**Method**: Temperature exceeds its 90th percentile for that location/date

```javascript
// Calculate the 90th percentile of all temperatures
const hotThreshold = percentile(dailyT2M, 90)

// Apply fallback for tropics (minimum 30°C)
const effectiveHotThreshold = Math.max(hotThreshold, 303) // 303K = 30°C

// Count exceedances
const hotCount = dailyT2M.filter(t => t >= effectiveHotThreshold).length
const hotProbability = hotCount / dailyT2M.length
```

**Why 90th percentile?**
- Represents "extreme" but not "unprecedented"
- ~10% probability by definition if threshold equals percentile
- Climatologically standard for heat waves

**Fallback threshold**: 30°C (303K)
- Ensures tropical regions still show meaningful results
- Prevents low thresholds in always-hot climates

**Examples**:
| Location | Historical Range | 90th Percentile | Effective Threshold | Interpretation |
|----------|------------------|-----------------|---------------------|----------------|
| **Phoenix (Summer)** | 30-45°C | 42°C | 42°C | Extreme desert heat |
| **Singapore** | 26-34°C | 32°C | 32°C | Tropical heat |
| **Reykjavik** | 8-22°C | 19°C | 30°C (fallback) | Never reaches "very hot" |
| **Chicago (Summer)** | 18-36°C | 33°C | 33°C | Heat wave conditions |

---

### 2. Very Cold (10th Percentile)

**Method**: Temperature falls below its 10th percentile for that location/date

```javascript
// Calculate the 10th percentile of all temperatures
const coldThreshold = percentile(dailyT2M, 10)

// Apply fallback for temperate regions (maximum 0°C)
const effectiveColdThreshold = Math.min(coldThreshold, 273) // 273K = 0°C

// Count exceedances
const coldCount = dailyT2M.filter(t => t <= effectiveColdThreshold).length
const coldProbability = coldCount / dailyT2M.length
```

**Why 10th percentile?**
- Represents bottom 10% = extreme cold
- Symmetric to "very hot" approach
- Captures cold snaps

**Fallback threshold**: 0°C (273K)
- Caps threshold at freezing point
- Prevents unreasonably high thresholds in tropical regions
- Ensures cold is meaningful (freezing conditions)

**Examples**:
| Location | Historical Range | 10th Percentile | Effective Threshold | Interpretation |
|----------|------------------|-----------------|---------------------|----------------|
| **Singapore** | 24-30°C | 25°C | 0°C (fallback) | Never reaches "very cold" |
| **Chicago (Winter)** | -20 to 5°C | -12°C | -12°C | Arctic blast |
| **Moscow** | -30 to -5°C | -25°C | -25°C | Severe cold |
| **Sydney** | 10-25°C | 12°C | 0°C (fallback) | Rarely freezes |

---

### 3. Very Windy (90th Percentile)

**Method**: Wind speed exceeds its 90th percentile for that location/date

```javascript
// Calculate wind speed from components
const windSpeeds = dailyU10M.map((u, i) => Math.sqrt(u² + dailyV10M[i]²))

// Calculate the 90th percentile
const windyThreshold = percentile(windSpeeds, 90)

// Apply fallback for calm regions (minimum 10 m/s)
const effectiveWindyThreshold = Math.max(windyThreshold, 10)

// Count exceedances
const windyCount = windSpeeds.filter(w => w >= effectiveWindyThreshold).length
const windyProbability = windyCount / windSpeeds.length
```

**Why 90th percentile?**
- Top 10% of windiest days
- Represents strong wind events
- Adapts to local wind climatology

**Fallback threshold**: 10 m/s (~22 mph, ~36 km/h)
- Beaufort Scale: Strong breeze / near gale
- Meteorologically significant wind
- Ensures "windy" means truly windy

**Examples**:
| Location | Historical Range | 90th Percentile | Effective Threshold | Interpretation |
|----------|------------------|-----------------|---------------------|----------------|
| **Chicago (Windy City)** | 2-15 m/s | 12 m/s | 12 m/s | Strong gusts |
| **Patagonia** | 5-25 m/s | 20 m/s | 20 m/s | Gale-force winds |
| **Amazon Rainforest** | 1-5 m/s | 4 m/s | 10 m/s (fallback) | Rarely windy |
| **Wellington, NZ** | 4-18 m/s | 15 m/s | 15 m/s | Frequent strong winds |

---

### 4. Very Wet (95th Percentile of Rainy Days)

**Method**: Precipitation exceeds the 95th percentile of rainy days (≥1mm)

```javascript
// Convert to mm/day
const precipMmPerDay = dailyPRECTOT.map(p => p * 86400)

// Filter to rainy days only (≥1mm)
const rainyDays = precipMmPerDay.filter(p => p >= 1)

if (rainyDays.length > 0) {
  // Use 95th percentile of rainy days
  const wetThreshold = percentile(rainyDays, 95)
  
  // Apply fallback (minimum 10 mm/day = R10mm standard)
  const effectiveWetThreshold = Math.max(wetThreshold, 10)
  
  // Count all days exceeding threshold
  const wetCount = precipMmPerDay.filter(p => p >= effectiveWetThreshold).length
} else {
  // Very dry climate - any precipitation is significant
  const effectiveWetThreshold = 1
}
```

**Why 95th percentile of rainy days?**
- Focuses on heavy rainfall events
- Ignores dry days (noise in the distribution)
- Follows WMO R10mm / R20mm methodology
- More extreme than 90th (top 5% of rainy days)

**Fallback threshold**: 10 mm/day (R10mm)
- Standard WMO climate index
- Represents "heavy precipitation day"
- Prevents low thresholds in dry climates

**Special case**: Arid regions
- If no rainy days, use 1mm as threshold
- Any precipitation is noteworthy

**Examples**:
| Location | Rainy Day Range | 95th Percentile | Effective Threshold | Interpretation |
|----------|-----------------|-----------------|---------------------|----------------|
| **Seattle** | 1-40 mm | 35 mm | 35 mm | Very heavy rain |
| **Mumbai (Monsoon)** | 5-200 mm | 150 mm | 150 mm | Intense monsoon |
| **Phoenix** | 0-25 mm | 20 mm | 20 mm | Rare heavy rain |
| **Sahara Desert** | 0-5 mm | 3 mm | 10 mm (fallback) | Extremely rare |

---

### 5. Very Uncomfortable (90th Percentile of BOTH)

**Method**: BOTH temperature AND humidity exceed their 90th percentiles simultaneously

```javascript
// Calculate both thresholds independently
const uncomfortableTempThreshold = percentile(dailyT2M, 90)
const uncomfortableHumidityThreshold = percentile(dailyQV2M, 90)

// Count days when BOTH conditions are met
let uncomfortableCount = 0
for (let i = 0; i < dailyT2M.length; i++) {
  if (dailyT2M[i] >= uncomfortableTempThreshold && 
      dailyQV2M[i] >= uncomfortableHumidityThreshold) {
    uncomfortableCount++
  }
}
const uncomfortableProbability = uncomfortableCount / dailyT2M.length
```

**Why BOTH 90th percentiles?**
- Captures the combination of heat AND humidity
- Neither alone causes discomfort in all climates
- Represents oppressive "sticky" conditions
- More sophisticated than simple threshold

**No fallback needed**:
- Always meaningful in any climate
- Dry heat → high temp, low humidity → not uncomfortable by this definition
- Cool humidity → low temp, high humidity → not uncomfortable
- Only hot + humid → uncomfortable

**Examples**:
| Location | 90th Temp | 90th Humidity | Interpretation |
|----------|-----------|---------------|----------------|
| **Houston** | 35°C | 18 g/kg | Muggy heat |
| **Phoenix** | 42°C | 8 g/kg | Dry heat (may not be "uncomfortable") |
| **Singapore** | 32°C | 20 g/kg | Oppressive humidity |
| **Dubai** | 43°C | 15 g/kg | Moderate discomfort |

---

## 📊 Probability Calculation

For all conditions, probability is calculated as:

```
P(condition) = count(days exceeding threshold) / total days analyzed
```

**Key insight**: With percentile-based thresholds, probabilities **should be around 10%** (for 90th percentile) or **5%** (for 95th percentile) by definition, but can vary because:

1. **Fallback thresholds** may raise/lower the bar
2. **Sample size** (45 years) introduces variance
3. **Climate trends** may shift distributions
4. **±7 day window** smooths daily variations

---

## 🌐 Global Applicability

### Tropical Regions (e.g., Singapore, Manila)
- ✅ **Hot**: 30-34°C range, 90th percentile works
- ✅ **Cold**: Never reaches 0°C, effectively 0% probability
- ✅ **Wet**: Monsoon extremes captured by 95th percentile
- ✅ **Uncomfortable**: High humidity + heat = meaningful

### Arid Regions (e.g., Phoenix, Riyadh)
- ✅ **Hot**: 40-45°C range, 90th percentile captures heat waves
- ✅ **Cold**: Rarely below 0°C, low probability
- ✅ **Wet**: 95th percentile with 10mm fallback ensures heavy rain is rare
- ✅ **Uncomfortable**: Dry heat may not trigger (humidity too low)

### Temperate Regions (e.g., New York, London)
- ✅ **Hot**: Seasonal heat waves captured
- ✅ **Cold**: Winter cold snaps captured
- ✅ **Wet**: Heavy rainfall events identified
- ✅ **Uncomfortable**: Summer humidity captured

### Polar Regions (e.g., Reykjavik, Fairbanks)
- ✅ **Hot**: Relative warmth (maybe 20°C) or fallback to 30°C (rarely reached)
- ✅ **Cold**: Severe cold snaps well below -20°C
- ✅ **Wet**: Precipitation events relative to local climate
- ✅ **Uncomfortable**: Rarely triggered (cold climate)

---

## 🔬 Scientific Validation

### Standards Followed:
1. **WMO Guidelines**: 90th/10th percentiles for extremes
2. **ETCCDI Climate Indices**: R10mm, TX90p, TN10p methodologies
3. **IPCC Reports**: Percentile-based extreme event definitions
4. **Local Climate Adaptation**: Relative to local historical baseline

### References:
- WMO Guidelines on Climate Indices (2009)
- ETCCDI: Expert Team on Climate Change Detection and Indices
- IPCC AR6: Chapter 11 on Weather and Climate Extreme Events
- Zhang et al. (2011): Indices for monitoring changes in extremes

---

## 💻 Implementation Code

### Percentile Function
```typescript
const percentile = (arr: number[], p: number): number => {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const index = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index % 1
  if (lower === upper) return sorted[lower]
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}
```

**Features**:
- Linear interpolation between values
- Handles any percentile (0-100)
- Robust to empty arrays
- Standard statistical method

---

## 📈 Output Format

```json
{
  "probabilities": {
    "hot": 0.12,
    "cold": 0.08,
    "windy": 0.15,
    "wet": 0.06,
    "uncomfortable": 0.09
  },
  "metadata": {
    "thresholds": {
      "hot": "T2M ≥ 32.5°C (90th percentile)",
      "cold": "T2M ≤ -8.2°C (10th percentile)",
      "windy": "Wind Speed ≥ 12.3 m/s (90th percentile)",
      "wet": "Precipitation ≥ 28.5 mm/day (95th percentile)",
      "uncomfortable": "Temp ≥ 30.1°C & Humidity ≥ 16.2 g/kg (90th percentiles)"
    },
    "thresholdDetails": {
      "hot": {
        "percentile": 90,
        "celsius": 32.5,
        "method": "percentile-based with 30°C minimum"
      },
      // ... more details
    }
  }
}
```

**Benefits**:
1. **Transparent**: Shows actual threshold values
2. **Traceable**: Explains calculation method
3. **Interpretable**: Users see local context
4. **Comparable**: Can compare across locations

---

## ✅ Advantages Over Fixed Thresholds

| Aspect | Fixed Thresholds | Percentile-Based | Winner |
|--------|------------------|------------------|--------|
| **Global Applicability** | ❌ Only temperate regions | ✅ All climates | Percentile |
| **Local Context** | ❌ Ignores climate | ✅ Adapts to location | Percentile |
| **Scientific Validity** | ❌ Arbitrary | ✅ WMO/IPCC standard | Percentile |
| **Tropical Accuracy** | ❌ Fails | ✅ Works | Percentile |
| **Arctic Accuracy** | ❌ Fails | ✅ Works | Percentile |
| **Interpretability** | ✅ Simple (35°C) | ⚠️ Varies by location | Fixed |
| **Computational Cost** | ✅ Fast | ⚠️ Slightly slower | Fixed |

**Verdict**: Percentile-based is scientifically superior for global analysis! ✅

---

## 🎯 Summary

**Before (Fixed)**: "35°C = hot everywhere" ❌
**After (Percentile)**: "Top 10% of temperatures at THIS location = hot" ✅

This approach:
- ✅ Works globally (tropics to poles)
- ✅ Follows scientific standards
- ✅ Adapts to local climate
- ✅ Provides meaningful results everywhere
- ✅ Maintains statistical rigor

**Result**: ClimaLens now provides climate-intelligent analysis that makes sense anywhere on Earth! 🌍🎉


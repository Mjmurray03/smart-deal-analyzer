# Smart Deal Analyzer - Project Context

## Overview
Commercial real estate investment analysis tool with flexible metric calculations and professional PDF report generation.

## Core Features
1. **Financial Metrics**
   - Cap Rate
   - Cash-on-Cash Return
   - DSCR (Debt Service Coverage Ratio)
   - IRR (Internal Rate of Return)
   - NOI (Net Operating Income)
   - ROI (Return on Investment)

2. **Flexible Calculations**
   - Toggle individual metrics on/off
   - Handle incomplete data gracefully
   - Show only available calculations

3. **Deal Assessment**
   - Visual indicators (Green/Yellow/Red)
   - Automatic rating based on enabled metrics
   - Customizable thresholds

4. **Professional Reports**
   - One-click PDF generation
   - Clean, professional formatting
   - Include only enabled metrics
   - Executive summary section

## Data Flow
1. User inputs property data
2. User toggles which metrics to calculate
3. System calculates enabled metrics only
4. Visual assessment based on available data
5. Generate PDF with active metrics

## Current Status
- [ ] Project setup
- [ ] Basic UI structure
- [ ] Calculation engine
- [ ] Metric toggle system
- [ ] PDF generation
- [ ] Deal assessment logic
- [ ] Final testing

## Key Implementation Notes
- All calculations must check if metric is enabled AND data exists
- Use null for metrics that cannot be calculated
- Display "N/A" in UI for null values
- PDF should only show enabled metrics with valid values

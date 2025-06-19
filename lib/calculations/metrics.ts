import { PropertyData, MetricFlags, CalculatedMetrics, DealAssessment, AssessmentLevel } from './types';
import { analyzeAssetMetrics, getAssetCalculationFunctions, validateAssetDataRequirements } from './asset-metrics';

/**
 * Calculates annual debt service payment based on loan details
 * @param loanAmount - Total loan amount
 * @param interestRate - Annual interest rate (as a decimal)
 * @param loanTerm - Loan term in years
 * @returns Annual debt service payment
 */
export function calculateAnnualDebtService(
  loanAmount: number,
  interestRate: number,
  loanTerm: number
): number {
  if (!loanAmount || !interestRate || !loanTerm) return 0;
  
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  // Calculate monthly payment using the loan amortization formula
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  // Return annual payment (monthly × 12)
  return monthlyPayment * 12;
}

/**
 * Formats metric values based on their type
 * @param value - The value to format
 * @param type - The type of metric ('percentage', 'currency', 'ratio')
 * @returns Formatted string value
 */
export function formatMetricValue(
  value: number | null | undefined,
  type: 'percentage' | 'currency' | 'ratio'
): string {
  if (value === null || value === undefined) return 'N/A';
  
  switch (type) {
    case 'percentage':
      return `${value.toFixed(2)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'ratio':
      return value.toFixed(2);
    default:
      return value.toString();
  }
}

/**
 * Checks if all required data fields are present for a specific metric
 * @param metric - The metric to check
 * @param data - Property data object
 * @returns boolean indicating if all required data is present
 */
export function hasRequiredData(
  metric: keyof MetricFlags,
  data: Partial<PropertyData>
): boolean {
  switch (metric) {
    case 'capRate':
      return !!(data.currentNOI && data.purchasePrice);
    case 'cashOnCash':
      return !!(data.annualCashFlow && data.totalInvestment);
    case 'dscr':
      return !!(data.currentNOI && data.loanAmount && data.interestRate && data.loanTerm);
    case 'roi':
      return !!(data.projectedNOI && data.purchasePrice && data.totalInvestment && data.currentNOI);
    case 'breakeven':
      return !!(data.operatingExpenses && data.grossIncome && data.loanAmount && data.interestRate && data.loanTerm);
    case 'irr':
      return !!(data.annualCashFlow && data.totalInvestment && data.projectedNOI && data.currentNOI);
    case 'pricePerSF':
      return !!(data.purchasePrice && data.squareFootage);
    case 'ltv':
      return !!(data.loanAmount && data.purchasePrice);
    case 'grm':
      return !!(data.purchasePrice && data.grossIncome);
    case 'pricePerUnit':
      return !!(data.purchasePrice && data.numberOfUnits);
    case 'egi':
      return !!(data.grossIncome && data.occupancyRate);
    default:
      return false;
  }
}

/**
 * Enhanced function to calculate all enabled metrics based on available property data
 * Now includes asset-specific analysis capabilities
 * @param data - Property data object
 * @param flags - Object indicating which metrics to calculate
 * @returns Object containing calculated metrics and asset-specific analysis
 */
export function calculateMetrics(
  data: PropertyData,
  flags: MetricFlags
): CalculatedMetrics & { assetAnalysis?: any } {
  const metrics: CalculatedMetrics & { assetAnalysis?: any } = {};

  // Cap Rate = (NOI / Purchase Price) × 100
  if (flags.capRate && data.currentNOI !== undefined && data.purchasePrice !== undefined && data.purchasePrice > 0) {
    metrics.capRate = (data.currentNOI / data.purchasePrice) * 100;
  }

  // Cash-on-Cash Return = (Annual Cash Flow / Total Investment) × 100
  if (flags.cashOnCash && data.annualCashFlow !== undefined && data.totalInvestment !== undefined && data.totalInvestment > 0) {
    metrics.cashOnCash = (data.annualCashFlow / data.totalInvestment) * 100;
  }

  // DSCR = NOI / Annual Debt Service
  if (flags.dscr && data.currentNOI !== undefined && data.loanAmount !== undefined && 
      data.interestRate !== undefined && data.loanTerm !== undefined) {
    const monthlyRate = data.interestRate / 100 / 12;
    const numPayments = data.loanTerm * 12;
    
    if (monthlyRate > 0) {
      const monthlyPayment = data.loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      const annualDebtService = monthlyPayment * 12;
      
      if (annualDebtService > 0) {
        metrics.dscr = data.currentNOI / annualDebtService;
      }
    }
  }

  // IRR (5-year approximation with property appreciation)
  if (flags.irr && data.annualCashFlow !== undefined && data.totalInvestment !== undefined && 
      data.currentNOI !== undefined && data.projectedNOI !== undefined && 
      data.totalInvestment > 0 && data.currentNOI > 0) {
    const noiGrowth = data.projectedNOI - data.currentNOI;
    const assumedCapRate = 0.08; // 8% exit cap rate
    const propertyAppreciation = noiGrowth / assumedCapRate;
    const totalCashFlows = (data.annualCashFlow * 5) + propertyAppreciation;
    const totalReturn = data.totalInvestment + totalCashFlows;
    
    if (totalReturn > 0 && data.totalInvestment > 0) {
      metrics.irr = (Math.pow(totalReturn / data.totalInvestment, 1/5) - 1) * 100;
    }
  }

  // ROI calculation - try both methods
  if (flags.roi) {
    // Method 1: Using NOI growth (preferred for packages)
    if (data.currentNOI !== undefined && data.projectedNOI !== undefined && 
        data.totalInvestment !== undefined && data.totalInvestment > 0) {
      const noiGrowth = data.projectedNOI - data.currentNOI;
      const assumedCapRate = 0.08;
      const propertyAppreciation = noiGrowth / assumedCapRate;
      const totalReturnPercent = (propertyAppreciation / data.totalInvestment) * 100;
      metrics.roi = totalReturnPercent / 5; // Annualized over 5 years
    }
    // Method 2: Simple cash-on-cash style ROI (fallback)
    else if (data.annualCashFlow !== undefined && data.totalInvestment !== undefined && 
             data.totalInvestment > 0) {
      // Simple ROI based on cash flow
      metrics.roi = (data.annualCashFlow / data.totalInvestment) * 100;
    }
  }

  // Breakeven = ((Operating Expenses + Annual Debt Service) / Gross Income) × 100
  if (flags.breakeven && data.operatingExpenses !== undefined && data.grossIncome !== undefined && 
      data.loanAmount !== undefined && data.interestRate !== undefined && 
      data.loanTerm !== undefined && data.grossIncome > 0) {
    const monthlyRate = data.interestRate / 100 / 12;
    const numPayments = data.loanTerm * 12;
    
    if (monthlyRate > 0) {
      const monthlyPayment = data.loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      const annualDebtService = monthlyPayment * 12;
      
      metrics.breakeven = ((data.operatingExpenses + annualDebtService) / data.grossIncome) * 100;
    }
  }

  // Enhanced: Add asset-specific analysis if property type is specified
  if (data.propertyType) {
    try {
      const assetFunctions = getAssetCalculationFunctions(data.propertyType);
      const validation = validateAssetDataRequirements(data, data.propertyType);
      
      if (validation.isValid && Object.keys(assetFunctions).length > 0) {
        // Add asset-specific analysis capabilities
        metrics.assetAnalysis = {
          availableFunctions: Object.keys(assetFunctions),
          dataValidation: validation,
          propertyType: data.propertyType
        };
      }
    } catch (error) {
      // Silently handle any asset-specific analysis errors
      console.warn('Asset-specific analysis not available:', error);
    }
  }

  return metrics;
}

// Calculate DSCR (NOI / Annual Debt Service)
// export function calculateDSCR(noi: number, annualDebtService: number): number {
//   if (!noi || !annualDebtService) return 0;
//   return noi / annualDebtService;
// }

// Calculate breakeven occupancy
// export function calculateBreakeven(
//   operatingExpenses: number,
//   grossIncome: number
// ): number {
//   if (!operatingExpenses || !grossIncome) return 0;
//   return (operatingExpenses / grossIncome) * 100;
// }

// Calculate Cap Rate
// export function calculateCapRate(noi: number, purchasePrice: number): number {
//   if (!noi || !purchasePrice) return 0;
//   return (noi / purchasePrice) * 100;
// }

// Calculate Cash on Cash Return
// export function calculateCashOnCash(annualCashFlow: number, totalInvestment: number): number {
//   if (!annualCashFlow || !totalInvestment) return 0;
//   return (annualCashFlow / totalInvestment) * 100;
// }

/**
 * Calculates the Return on Investment
 * @param annualCashFlow Annual cash flow
 * @param totalInvestment Initial investment amount
 * @param holdingPeriod Holding period in years
 * @param currentNOI Current Net Operating Income
 * @param projectedNOI Projected Net Operating Income
 * @param capRate Current cap rate
 * @returns ROI as a percentage (e.g., 15.3 for 15.3%)
 */
export function calculateROI(
  annualCashFlow: number,
  totalInvestment: number,
  holdingPeriod: number,
  currentNOI: number,
  projectedNOI: number,
  capRate: number
): number {
  console.log('ROI Calculation Inputs:', {
    annualCashFlow,
    totalInvestment,
    holdingPeriod,
    currentNOI,
    projectedNOI,
    capRate
  });

  if (!annualCashFlow || !totalInvestment || !holdingPeriod || !currentNOI || !projectedNOI) {
    console.log('ROI Calculation: Missing required inputs');
    return 0;
  }

  if (totalInvestment <= 0 || holdingPeriod <= 0) {
    console.log('ROI Calculation: Invalid investment or holding period');
    return 0;
  }

  // Calculate property appreciation based on NOI growth
  const noiGrowth = projectedNOI - currentNOI;
  let propertyAppreciation = 0;

  // Only calculate appreciation if we have a valid cap rate
  if (capRate && capRate > 0) {
    propertyAppreciation = noiGrowth / (capRate / 100); // Convert cap rate from percentage to decimal
  } else {
    // If no cap rate, use a conservative estimate based on NOI growth
    propertyAppreciation = noiGrowth * 10; // Assume 10x NOI growth as property value
  }

  // Calculate total return (cash flow + appreciation)
  const totalCashFlow = annualCashFlow * holdingPeriod;
  const totalReturn = totalCashFlow + propertyAppreciation;

  console.log('ROI Calculation Steps:', {
    step1: `NOI Growth = Projected NOI - Current NOI = ${projectedNOI} - ${currentNOI} = ${noiGrowth}`,
    step2: `Property Appreciation = ${propertyAppreciation}`,
    step3: `Total Cash Flow = Annual Cash Flow × Holding Period = ${annualCashFlow} × ${holdingPeriod} = ${totalCashFlow}`,
    step4: `Total Return = Total Cash Flow + Property Appreciation = ${totalCashFlow} + ${propertyAppreciation} = ${totalReturn}`,
    step5: `ROI = (Total Return / Total Investment) × 100 = (${totalReturn} / ${totalInvestment}) × 100`
  });

  // Calculate ROI
  const roi = (totalReturn / totalInvestment) * 100;

  console.log('Final ROI:', roi);

  // Validate the result
  if (isNaN(roi) || !isFinite(roi)) {
    console.log('ROI Calculation: Result is NaN or infinite');
    return 0;
  }

  return Math.max(roi, 0);
}

// Calculate IRR using a simplified approximation
export function calculateIRR(
  annualCashFlow: number,
  totalInvestment: number,
  holdingPeriod: number,
  currentNOI: number,
  projectedNOI: number,
  capRate: number
): number {
  console.log('IRR Calculation Inputs:', {
    annualCashFlow,
    totalInvestment,
    holdingPeriod,
    currentNOI,
    projectedNOI,
    capRate
  });

  // Validate inputs
  if (!annualCashFlow || !totalInvestment || !holdingPeriod || !currentNOI || !projectedNOI) {
    console.log('IRR Calculation: Missing required inputs');
    return 0;
  }

  if (totalInvestment <= 0) {
    console.log('IRR Calculation: Total investment must be greater than 0');
    return 0;
  }

  if (holdingPeriod <= 0) {
    console.log('IRR Calculation: Holding period must be greater than 0');
    return 0;
  }

  // Calculate property appreciation based on NOI growth
  const noiGrowth = projectedNOI - currentNOI;
  let propertyAppreciation = 0;

  // Only calculate appreciation if we have a valid cap rate
  if (capRate && capRate > 0) {
    propertyAppreciation = noiGrowth / (capRate / 100); // Convert cap rate from percentage to decimal
  } else {
    // If no cap rate, use a conservative estimate based on NOI growth
    propertyAppreciation = noiGrowth * 10; // Assume 10x NOI growth as property value
  }
  
  // Calculate total return (cash flow + appreciation)
  const totalCashFlow = annualCashFlow * holdingPeriod;
  const totalReturn = totalCashFlow + propertyAppreciation;
  
  console.log('IRR Calculation Steps:', {
    step1: `NOI Growth = Projected NOI - Current NOI = ${projectedNOI} - ${currentNOI} = ${noiGrowth}`,
    step2: `Property Appreciation = ${propertyAppreciation}`,
    step3: `Total Cash Flow = Annual Cash Flow × Holding Period = ${annualCashFlow} × ${holdingPeriod} = ${totalCashFlow}`,
    step4: `Total Return = Total Cash Flow + Property Appreciation = ${totalCashFlow} + ${propertyAppreciation} = ${totalReturn}`,
    step5: `IRR = (Total Return / Total Investment)^(1/holdingPeriod) - 1 = (${totalReturn} / ${totalInvestment})^(1/${holdingPeriod}) - 1`
  });

  // Ensure total return is positive
  if (totalReturn <= 0) {
    console.log('IRR Calculation: Total return is not positive');
    return 0;
  }

  // Calculate IRR using the formula: IRR = (Total Return / Total Investment)^(1/holdingPeriod) - 1
  const irr = (Math.pow(totalReturn / totalInvestment, 1 / holdingPeriod) - 1) * 100;
  
  console.log('Final IRR:', irr);

  // Validate the result
  if (isNaN(irr) || !isFinite(irr)) {
    console.log('IRR Calculation: Result is NaN or infinite');
    return 0;
  }

  // Cap the IRR at a reasonable maximum (e.g., 50%)
  return Math.min(Math.max(irr, 0), 50);
}

// Calculate all metrics
export function calculateAllMetrics(propertyData: PropertyData, flags: MetricFlags): CalculatedMetrics {
  const metrics: CalculatedMetrics = {};

  if (flags.capRate && propertyData.currentNOI && propertyData.purchasePrice) {
    metrics.capRate = calculateCapRate(propertyData.currentNOI, propertyData.purchasePrice);
  }

  if (flags.cashOnCash && propertyData.annualCashFlow && propertyData.totalInvestment) {
    metrics.cashOnCash = calculateCashOnCash(propertyData.annualCashFlow, propertyData.totalInvestment);
  }

  if (flags.dscr && propertyData.currentNOI && propertyData.loanAmount && 
      propertyData.interestRate && propertyData.loanTerm) {
    metrics.dscr = calculateDSCR(
      propertyData.currentNOI,
      propertyData.loanAmount,
      propertyData.interestRate,
      propertyData.loanTerm
    );
  }

  if (flags.irr && propertyData.annualCashFlow && propertyData.totalInvestment && 
      propertyData.currentNOI && propertyData.projectedNOI && propertyData.holdingPeriod) {
    metrics.irr = calculateIRR(
      propertyData.annualCashFlow,
      propertyData.totalInvestment,
      propertyData.holdingPeriod,
      propertyData.currentNOI,
      propertyData.projectedNOI,
      metrics.capRate || 0
    );
  }

  if (flags.roi && propertyData.annualCashFlow && propertyData.totalInvestment && 
      propertyData.holdingPeriod && propertyData.currentNOI && propertyData.projectedNOI) {
    metrics.roi = calculateROI(
      propertyData.annualCashFlow,
      propertyData.totalInvestment,
      propertyData.holdingPeriod,
      propertyData.currentNOI,
      propertyData.projectedNOI,
      metrics.capRate || 0
    );
  }

  if (flags.breakeven && propertyData.operatingExpenses && propertyData.grossIncome && 
      propertyData.loanAmount && propertyData.interestRate && propertyData.loanTerm) {
    metrics.breakeven = calculateBreakeven(
      propertyData.operatingExpenses,
      propertyData.grossIncome,
      propertyData.loanAmount,
      propertyData.interestRate,
      propertyData.loanTerm
    );
  }

  return metrics;
}

// Calculate deal assessment
export function calculateDealAssessment(metrics: CalculatedMetrics, flags: MetricFlags): DealAssessment {
  const activeMetrics = Object.values(flags).filter(Boolean).length;
  
  if (activeMetrics === 0) {
    return {
      overall: 'Poor',
      recommendation: 'Please enable metrics to get an assessment.',
      metricScores: {},
      activeMetrics: 0
    };
  }

  const scores: { [key: string]: AssessmentLevel } = {};
  let excellentCount = 0;
  let goodCount = 0;
  let fairCount = 0;
  let poorCount = 0;

  // Assess each enabled metric
  if (flags.capRate && typeof metrics.capRate === 'number' && metrics.capRate > 0) {
    scores.capRate = metrics.capRate >= 8 ? 'Excellent' : metrics.capRate >= 6 ? 'Good' : 'Fair';
    if (scores.capRate === 'Excellent') excellentCount++;
    else if (scores.capRate === 'Good') goodCount++;
    else if (scores.capRate === 'Fair') fairCount++;
    else poorCount++;
  }

  if (flags.cashOnCash && typeof metrics.cashOnCash === 'number' && metrics.cashOnCash > 0) {
    scores.cashOnCash = metrics.cashOnCash >= 8 ? 'Excellent' : metrics.cashOnCash >= 6 ? 'Good' : 'Fair';
    if (scores.cashOnCash === 'Excellent') excellentCount++;
    else if (scores.cashOnCash === 'Good') goodCount++;
    else if (scores.cashOnCash === 'Fair') fairCount++;
    else poorCount++;
  }

  if (flags.dscr && typeof metrics.dscr === 'number' && metrics.dscr > 0) {
    scores.dscr = metrics.dscr >= 1.25 ? 'Excellent' : metrics.dscr >= 1.1 ? 'Good' : 'Fair';
    if (scores.dscr === 'Excellent') excellentCount++;
    else if (scores.dscr === 'Good') goodCount++;
    else if (scores.dscr === 'Fair') fairCount++;
    else poorCount++;
  }

  if (flags.irr && typeof metrics.irr === 'number' && metrics.irr > 0) {
    scores.irr = metrics.irr >= 12 ? 'Excellent' : metrics.irr >= 8 ? 'Good' : 'Fair';
    if (scores.irr === 'Excellent') excellentCount++;
    else if (scores.irr === 'Good') goodCount++;
    else if (scores.irr === 'Fair') fairCount++;
    else poorCount++;
  }

  if (flags.roi && typeof metrics.roi === 'number' && metrics.roi > 0) {
    scores.roi = metrics.roi >= 12 ? 'Excellent' : metrics.roi >= 8 ? 'Good' : 'Fair';
    if (scores.roi === 'Excellent') excellentCount++;
    else if (scores.roi === 'Good') goodCount++;
    else if (scores.roi === 'Fair') fairCount++;
    else poorCount++;
  }

  if (flags.breakeven && typeof metrics.breakeven === 'number' && metrics.breakeven > 0) {
    scores.breakeven = metrics.breakeven <= 85 ? 'Excellent' : metrics.breakeven <= 90 ? 'Good' : 'Fair';
    if (scores.breakeven === 'Excellent') excellentCount++;
    else if (scores.breakeven === 'Good') goodCount++;
    else if (scores.breakeven === 'Fair') fairCount++;
    else poorCount++;
  }

  // Determine overall assessment
  let overall: AssessmentLevel;
  let recommendation: string;

  if (excellentCount > goodCount && excellentCount > fairCount && excellentCount > poorCount) {
    overall = 'Excellent';
    recommendation = 'This deal shows excellent potential with multiple positive metrics.';
  } else if (goodCount >= excellentCount && goodCount >= fairCount && goodCount >= poorCount) {
    overall = 'Good';
    recommendation = 'This deal shows good potential. Consider negotiating better terms.';
  } else if (fairCount > excellentCount && fairCount > goodCount && fairCount > poorCount) {
    overall = 'Fair';
    recommendation = 'This deal shows moderate potential with some areas of concern.';
  } else {
    overall = 'Poor';
    recommendation = 'This deal shows several areas of concern. Consider passing or renegotiating.';
  }

  return {
    overall,
    recommendation,
    metricScores: scores,
    activeMetrics: Object.keys(scores).length
  };
}

/**
 * Calculates the price per square foot of a property
 * @param purchasePrice Total purchase price of the property
 * @param squareFootage Total square footage of the property
 * @returns Price per square foot
 */
export function calculatePricePerSF(purchasePrice: number, squareFootage: number): number {
  if (!squareFootage || squareFootage <= 0) {
    throw new Error('Square footage must be greater than 0');
  }
  return purchasePrice / squareFootage;
}

/**
 * Calculates the Loan-to-Value ratio
 * @param loanAmount Amount of the loan
 * @param purchasePrice Total purchase price of the property
 * @returns LTV as a percentage (e.g., 75 for 75%)
 */
export function calculateLTV(loanAmount: number, purchasePrice: number): number {
  if (!purchasePrice || purchasePrice <= 0) {
    throw new Error('Purchase price must be greater than 0');
  }
  return (loanAmount / purchasePrice) * 100;
}

/**
 * Calculates the Gross Rent Multiplier
 * @param purchasePrice Total purchase price of the property
 * @param grossIncome Annual gross income
 * @returns Gross Rent Multiplier
 */
export function calculateGrossRentMultiplier(purchasePrice: number, grossIncome: number): number {
  if (!grossIncome || grossIncome <= 0) {
    throw new Error('Gross income must be greater than 0');
  }
  return purchasePrice / grossIncome;
}

/**
 * Calculates the price per unit for multifamily properties
 * @param purchasePrice Total purchase price of the property
 * @param numberOfUnits Number of units in the property
 * @returns Price per unit
 */
export function calculatePricePerUnit(purchasePrice: number, numberOfUnits: number): number {
  if (!numberOfUnits || numberOfUnits <= 0) {
    throw new Error('Number of units must be greater than 0');
  }
  return purchasePrice / numberOfUnits;
}

/**
 * Calculates the Effective Gross Income considering occupancy
 * @param grossIncome Potential gross income
 * @param occupancyRate Occupancy rate as a percentage (e.g., 95 for 95%)
 * @returns Effective gross income
 */
export function calculateEffectiveGrossIncome(grossIncome: number, occupancyRate: number): number {
  if (occupancyRate < 0 || occupancyRate > 100) {
    throw new Error('Occupancy rate must be between 0 and 100');
  }
  return grossIncome * (occupancyRate / 100);
}

/**
 * Calculates the Cap Rate
 * @param currentNOI Net Operating Income
 * @param purchasePrice Total purchase price of the property
 * @returns Cap Rate as a percentage (e.g., 6.5 for 6.5%)
 */
export function calculateCapRate(currentNOI: number, purchasePrice: number): number {
  if (!purchasePrice || purchasePrice <= 0) {
    throw new Error('Purchase price must be greater than 0');
  }
  return (currentNOI / purchasePrice) * 100;
}

/**
 * Calculates the Cash-on-Cash Return
 * @param annualCashFlow Annual cash flow
 * @param totalInvestment Total investment amount
 * @returns Cash-on-Cash Return as a percentage (e.g., 8.2 for 8.2%)
 */
export function calculateCashOnCash(annualCashFlow: number, totalInvestment: number): number {
  if (!totalInvestment || totalInvestment <= 0) {
    throw new Error('Total investment must be greater than 0');
  }
  return (annualCashFlow / totalInvestment) * 100;
}

/**
 * Calculates the Debt Service Coverage Ratio
 * @param currentNOI Net Operating Income
 * @param loanAmount Amount of the loan
 * @param interestRate Annual interest rate as a percentage (e.g., 5.5 for 5.5%)
 * @param loanTerm Loan term in years
 * @returns Debt Service Coverage Ratio
 */
export function calculateDSCR(
  currentNOI: number,
  loanAmount: number,
  interestRate: number,
  loanTerm: number
): number {
  if (!loanAmount || loanAmount <= 0) {
    throw new Error('Loan amount must be greater than 0');
  }
  if (interestRate <= 0 || interestRate > 100) {
    throw new Error('Interest rate must be between 0 and 100');
  }
  if (!loanTerm || loanTerm <= 0) {
    throw new Error('Loan term must be greater than 0');
  }

  // Calculate monthly payment using the loan amortization formula
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const annualDebtService = monthlyPayment * 12;
  return currentNOI / annualDebtService;
}

/**
 * Calculates the Breakeven Point
 * @param operatingExpenses Total operating expenses
 * @param grossIncome Gross income
 * @returns Breakeven occupancy rate as a percentage (e.g., 85.5 for 85.5%)
 */
export function calculateBreakeven(
  operatingExpenses: number,
  grossIncome: number,
  loanAmount: number,
  interestRate: number,
  loanTerm: number
): number {
  if (!operatingExpenses || !grossIncome || !loanAmount || !interestRate || !loanTerm) return 0;
  
  const annualDebtService = calculateAnnualDebtService(loanAmount, interestRate, loanTerm);
  return ((operatingExpenses + annualDebtService) / grossIncome) * 100;
} 
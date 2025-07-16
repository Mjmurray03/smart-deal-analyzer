import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock window methods
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    reload: jest.fn(),
  },
  writable: true,
});

// Mock console methods for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Only log actual errors, not React warnings in tests
  if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Suppress specific warnings in tests
  if (typeof args[0] === 'string' && args[0].includes('componentWillReceiveProps')) {
    return;
  }
  originalConsoleWarn(...args);
};

// Global test utilities
global.testUtils = {
  mockPropertyData: {
    propertyType: 'office',
    purchasePrice: 1000000,
    currentNOI: 80000,
    totalInvestment: 250000,
    annualCashFlow: 50000,
    loanAmount: 750000,
    interestRate: 5.5,
    loanTerm: 30,
    grossIncome: 120000,
    operatingExpenses: 40000,
    squareFootage: 10000,
    numberOfUnits: 1,
    occupancyRate: 95
  },
  
  mockMetricFlags: {
    capRate: true,
    cashOnCash: true,
    dscr: true,
    ltv: true,
    pricePerSF: true,
    grm: true,
    roi: false,
    breakeven: false,
    irr: false,
    pricePerUnit: false,
    egi: false,
    walt: false,
    simpleWalt: false,
    salesPerSF: false,
    clearHeightAnalysis: false,
    revenuePerUnit: false,
    industrialMetrics: false,
    multifamilyMetrics: false,
    occupancyCostRatio: false,
    effectiveRentPSF: false
  }
};
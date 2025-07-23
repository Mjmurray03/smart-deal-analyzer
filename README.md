# 🏢 Smart Deal Analyzer

## Project Overview

**Smart Deal Analyzer** is a beta AI-powered tool for underwriting small-balance commercial real estate deals ($1-10M) in the Dallas-Fort Worth market. Built by a business student passionate about CRE and AI, this tool focuses on simple deal scoring and rent roll analysis to help investors quickly evaluate opportunities in the DFW market.

The platform's initial vision centers on DFW market specialization—providing localized deal scoring algorithms and rent roll parsing capabilities tailored specifically to Texas commercial real estate patterns and submarkets.

**Current Status**: Beta v0.1.0 with known UI bugs and calculation issues. Built as a learning project to explore AI applications in commercial real estate underwriting.

## ✨ Features (Currently Working)

### 📊 **Core Calculators**
- **Cap Rate Calculator**: Standard capitalization rate analysis
- **Cash-on-Cash Return**: Calculate return on invested capital
- **Gross Rent Multiplier (GRM)**: Property price vs rental income analysis  
- **Price per Square Foot**: Market comparison tool

### 🏢 **Property Support**
- **5 Property Types**: Office, Retail, Multifamily, Industrial, Mixed-Use
- **Basic Analysis Modes**: Quick screening and detailed input forms
- **DFW Market Focus**: Designed with Dallas-Fort Worth market patterns in mind

### 💻 **Technical Features**
- **Mobile-Responsive UI**: Works on desktop, tablet, and mobile devices
- **Modern Stack**: Next.js 15, React 19, TypeScript 5
- **Basic PDF Reports**: Export simple analysis summaries
- **Local Storage**: Save draft analyses

## 🚀 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Setup
```bash
# Clone the repository
git clone https://github.com/Mjmurray03/smart-deal-analyzer.git
cd smart-deal-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Usage

### Quick Start
1. **Select Calculator**: Choose from Cap Rate, Cash-on-Cash, GRM, or Price/SF
2. **Input Deal Data**: Enter property financials (NOI, purchase price, etc.)
3. **Get Results**: Review calculated metrics and basic deal scoring

### Example: DFW Office Building Analysis
```javascript
// Sample deal data (see public/sample-deal.json)
{
  "propertyType": "office",
  "purchasePrice": 2500000,
  "currentNOI": 180000,
  "squareFootage": 15000,
  "location": "Dallas CBD"
}

// Expected Results:
// Cap Rate: 7.2%
// Price/SF: $167
// Deal Score: B+ (for DFW office market)
```

### Sample Data
Check `public/sample-deal.json` for example property data you can use to test the analyzers.

## 🚧 Current Status

**Beta Version 0.1.0** - This is an early-stage project with known limitations:

### Known Issues
- **UI Bugs**: Form overlaps and mobile layout issues
- **Calculation Errors**: Some edge cases not handled properly
- **Performance**: Occasional slowness with large datasets
- **Incomplete Features**: Advanced analysis modes are basic

### Feedback Welcome
- **GitHub Issues**: Report bugs or suggest features
- **LinkedIn DM**: Connect with me [@Mjmurray03](https://linkedin.com/in/mjmurray03) for discussion
- **Pull Requests**: Contributions are encouraged!

## 🤝 Contributing

I welcome contributions from the community! This is a learning project, and I'd love to collaborate with other developers and CRE professionals.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes and test locally
4. Commit with clear messages
5. Push and create a Pull Request

### Areas Needing Help
- UI/UX improvements and bug fixes
- Calculation accuracy and edge cases
- DFW market data integration ideas
- Performance optimizations

## 👨‍💼 About

Hi! I'm Michael Murray, a 21-year-old business student passionate about the intersection of commercial real estate and artificial intelligence. This project represents my exploration of how AI can streamline CRE underwriting, starting with the Dallas-Fort Worth market I know well.

**Why DFW?** By focusing on a single market initially, I can build deeper, more accurate analysis tools rather than trying to solve everything at once. The goal is to create genuinely useful software for small-balance CRE investors in Texas.

**Read More**: Check out my LinkedIn article about AI in commercial real estate (July 23, 2025) for the full vision behind this project.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.3.3, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with custom design system
- **Animation**: Framer Motion
- **Testing**: Jest with TypeScript support
- **Deployment**: Vercel-ready configuration

## 📊 Project Roadmap

### Immediate (Q1 2025)
- Fix UI bugs and improve mobile experience
- Enhance calculation accuracy and validation
- Add more DFW-specific market data

### Medium-term (Q2-Q3 2025)
- Improved rent roll analysis capabilities
- User authentication and saved analyses
- Enhanced PDF reporting

### Long-term (Q4 2025)
- Advanced DFW submarket scoring
- Integration with public data sources
- Expanded Texas market coverage

## 📄 License

This project is proprietary software with all rights reserved.

**Copyright (c) 2025 Michael Murray. All Rights Reserved.**

For licensing inquiries, please contact: mjmurray234@gmail.com

## 🙏 Acknowledgments

- **Next.js Team** for the incredible framework
- **DFW CRE Community** for inspiration and market insights
- **Fellow Students** and **Mentors** who provided feedback and encouragement

---

**Built with ❤️ by a business student passionate about CRE + AI**

*Interested in the vision? Read my [LinkedIn article](https://linkedin.com/in/mjmurray03) about AI's role in commercial real estate.*
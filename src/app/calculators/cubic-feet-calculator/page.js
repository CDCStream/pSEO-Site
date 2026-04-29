import CubicFeetClient from './CubicFeetClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Ruler, Box, Calculator, Download } from 'lucide-react';

export const metadata = {
  title: 'Cubic Feet Calculator - Calculate Volume in ft³, m³, yd³ | MakerSilo',
  description: 'Free cubic feet calculator to find volume of a space or container. Supports feet, inches, meters, cm, and yards. Convert between cubic feet, cubic meters, cubic yards, and square footage.',
  keywords: 'cubic feet calculator, cubic footage calculator, volume calculator, cubic feet to cubic yards, cubic feet to cubic meters, square footage calculator, CBM calculator, ft3 calculator',
  openGraph: {
    title: 'Cubic Feet Calculator - Calculate Volume in ft³, m³, yd³',
    description: 'Free cubic feet calculator to find volume of a space or container. Supports multiple units and conversions.',
    type: 'website',
  },
};

const steps = [
  { icon: Calculator, title: 'Select Mode & Units', description: 'Choose a calculation mode (Cubic Feet, Square Footage, CBM, or Cubic Yards) and your preferred input unit (feet, inches, yards, meters, or cm).' },
  { icon: Ruler, title: 'Enter Dimensions', description: 'Input the width, length, and height of the space or object you want to measure. When using feet, you can add extra inches for precision.' },
  { icon: Box, title: 'Calculate Volume', description: 'Click Calculate to instantly see the volume in multiple units: cubic feet, cubic meters, cubic yards, cubic inches, gallons, and liters.' },
  { icon: Download, title: 'Use Your Results', description: 'Use the calculated volume for construction projects, shipping estimates, storage planning, landscaping, and more.' },
];

const faqs = [
  { q: 'How do I calculate cubic feet?', a: 'Multiply the length × width × height of the space, all measured in feet. For example, a room that is 10 ft long, 12 ft wide, and 8 ft high has a volume of 10 × 12 × 8 = 960 cubic feet. Our calculator handles unit conversions automatically if you measure in inches, meters, or other units.' },
  { q: 'How many cubic feet are in a cubic yard?', a: 'There are 27 cubic feet in one cubic yard. A cubic yard is 3 feet × 3 feet × 3 feet = 27 cubic feet. To convert cubic feet to cubic yards, divide by 27. To convert cubic yards to cubic feet, multiply by 27.' },
  { q: 'How do I convert cubic feet to cubic meters?', a: 'Multiply the number of cubic feet by 0.0283168 to get cubic meters. For example, 100 cubic feet × 0.0283168 = 2.83168 cubic meters. Our calculator performs this conversion automatically.' },
  { q: 'How many gallons are in a cubic foot?', a: 'One cubic foot equals approximately 7.48052 US gallons. To find how many gallons fit in a space, calculate the cubic feet and multiply by 7.48052. This is useful for aquariums, pools, and tanks.' },
  { q: 'How do I calculate cubic feet from inches?', a: 'Measure all dimensions in inches, multiply them together to get cubic inches, then divide by 1,728 (since 12³ = 1,728 cubic inches per cubic foot). Alternatively, convert each dimension to feet first by dividing by 12, then multiply.' },
  { q: 'What is CBM and how is it related to cubic feet?', a: 'CBM stands for Cubic Meters, the metric equivalent of cubic feet. One cubic meter equals approximately 35.3147 cubic feet. CBM is commonly used in international shipping to calculate cargo volume and freight costs.' },
];

const longContent = `The Cubic Feet Calculator is a versatile measurement tool designed to help you calculate volume and area for any rectangular space or object. Whether you are planning a home improvement project, estimating shipping costs, measuring storage capacity, or ordering landscaping materials, this calculator provides instant, accurate results in multiple units.

Understanding cubic measurements is essential for many everyday tasks. Cubic feet (ft³) is the standard unit of volume in the United States for measuring the capacity of rooms, appliances, containers, and construction materials. One cubic foot represents the volume of a cube that measures one foot on each side — 12 inches × 12 inches × 12 inches, or 1,728 cubic inches.

Our calculator supports four distinct calculation modes. The Cubic Feet mode calculates three-dimensional volume using width, length, and height measurements. The Square Footage mode calculates two-dimensional area using only width and length — perfect for flooring, painting, or lawn care projects. The CBM (Cubic Meters) mode presents results with cubic meters as the primary unit, ideal for international shipping and freight calculations. The Cubic Yards mode is designed for construction and landscaping projects where materials like concrete, mulch, gravel, and soil are typically sold by the cubic yard.

The unit selector allows you to input measurements in feet, inches, yards, meters, or centimeters. When feet is selected, additional inch fields appear for each dimension, allowing you to enter measurements like "5 feet 7 inches" directly without manual conversion. All other unit selections automatically convert your inputs to feet internally for calculation, then present results in all common units simultaneously.

For construction projects, knowing the cubic footage is critical. When ordering concrete for a foundation or patio, you need the volume in cubic yards. A standard concrete truck typically holds 8 to 10 cubic yards. When buying mulch or gravel for landscaping, suppliers usually sell by the cubic yard. Our calculator instantly converts between cubic feet and cubic yards, eliminating the need for manual division by 27.

The calculator is equally useful for interior measurements. Need to know if a new refrigerator will fit your space? Measure the opening in feet and inches. Want to calculate the heating or cooling requirements for a room? HVAC systems are sized based on cubic footage. Planning to fill a raised garden bed with soil? Calculate the volume and order the right amount without waste.

For shipping and logistics, CBM is the international standard. Freight companies calculate costs based on volumetric weight, which is determined by the package dimensions. Our CBM mode makes it easy to calculate the total volume of your shipment, whether you are measuring in feet, inches, centimeters, or meters.

The results section displays all relevant conversions simultaneously. For volume calculations, you see cubic feet, cubic meters, cubic yards, cubic inches, US gallons, and liters. For area calculations, you see square feet, square meters, square yards, square inches, and acres. The decimal precision selector lets you choose between 1 and 5 decimal places depending on the level of accuracy you need.

Real-world applications include measuring moving truck capacity, sizing air conditioners for rooms, calculating aquarium or pool water volume, estimating concrete or asphalt needs, determining soil or mulch quantities, measuring luggage or cargo space, and comparing appliance capacities. The calculator handles all of these scenarios with a simple, intuitive interface.`;

export default function CubicFeetCalculatorPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://makersilo.com' },
              { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://makersilo.com/calculators' },
              { '@type': 'ListItem', position: 3, name: 'Cubic Feet Calculator' },
            ],
          }),
        }}
      />
      <ToolSchema
        name="Cubic Feet Calculator"
        description="Free cubic feet calculator to find volume of a space or container. Supports feet, inches, meters, cm, and yards with instant conversions."
        category="Calculator"
        url="https://makersilo.com/calculators/cubic-feet-calculator"
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/calculators/" className="hover:text-white transition-colors">Calculators</a>
            <span>/</span>
            <span className="text-gray-300">Cubic Feet Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Cubic Feet Calculator
            </h1>
            <p className="text-lg text-gray-400">
              Calculate the cubic footage volume of a space, container, or object using width, length, and height. Convert between cubic feet, cubic meters, cubic yards, and more.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <CubicFeetClient />

            <HowToUse keyword="Cubic Feet Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="Cubic Feet Calculator" />
            <LongContent content={longContent} keyword="Cubic Feet Calculator" />

            <AdSlot position="below-content" />
          </div>

          <div className="hidden xl:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdSlot position="sidebar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

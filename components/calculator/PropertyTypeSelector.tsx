import { motion } from 'framer-motion';
import { BuildingOfficeIcon, ShoppingCartIcon, CubeIcon, HomeModernIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { PropertyType } from '@/lib/calculations/types';

interface PropertyTypeSelectorProps {
  selected: PropertyType | null;
  onSelect: (type: PropertyType) => void;
}

const propertyTypes: Array<{
  id: PropertyType;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
  shadowColor: string;
}> = [
  {
    id: 'office',
    name: 'Office',
    description: 'Commercial office buildings and corporate spaces',
    icon: BuildingOfficeIcon,
    gradient: 'from-blue-400 to-blue-600',
    shadowColor: 'shadow-blue-500/20'
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Shopping centers, stores, and restaurants',
    icon: ShoppingCartIcon,
    gradient: 'from-green-400 to-green-600',
    shadowColor: 'shadow-green-500/20'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Warehouses, manufacturing, and logistics',
    icon: CubeIcon,
    gradient: 'from-purple-400 to-purple-600',
    shadowColor: 'shadow-purple-500/20'
  },
  {
    id: 'multifamily',
    name: 'Multifamily',
    description: 'Apartment buildings and residential complexes',
    icon: HomeModernIcon,
    gradient: 'from-orange-400 to-orange-600',
    shadowColor: 'shadow-orange-500/20'
  },
  {
    id: 'mixed-use',
    name: 'Mixed-Use',
    description: 'Combined residential, commercial, and retail spaces',
    icon: BuildingStorefrontIcon,
    gradient: 'from-pink-400 to-pink-600',
    shadowColor: 'shadow-pink-500/20'
  }
];

export default function PropertyTypeSelector({ selected, onSelect }: PropertyTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          What type of property are you analyzing?
        </h2>
        <p className="mt-3 text-lg text-gray-600">
          Select your property type to see tailored calculations and metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {propertyTypes.map((type, index) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;
          
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(type.id)}
              className={`
                relative group p-6 rounded-2xl transition-all duration-300
                ${isSelected 
                  ? `bg-gradient-to-r ${type.gradient} text-white shadow-xl ${type.shadowColor}` 
                  : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Icon Container */}
              <div className={`
                inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4
                ${isSelected 
                  ? 'bg-white/20' 
                  : `bg-gradient-to-r ${type.gradient} bg-opacity-10`
                }
              `}>
                <Icon className={`
                  h-8 w-8 transition-colors
                  ${isSelected ? 'text-white' : 'text-gray-700'}
                `} />
              </div>
              
              {/* Content */}
              <h3 className={`
                text-xl font-bold mb-2
                ${isSelected ? 'text-white' : 'text-gray-900'}
              `}>
                {type.name}
              </h3>
              <p className={`
                text-sm leading-relaxed
                ${isSelected ? 'text-white/90' : 'text-gray-600'}
              `}>
                {type.description}
              </p>
              
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4"
                >
                  <div className="bg-white rounded-full p-1">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.div>
              )}
              
              {/* Hover Effect */}
              {!isSelected && (
                <div className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-r ${type.gradient} opacity-0 
                  group-hover:opacity-5 transition-opacity duration-300
                `} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
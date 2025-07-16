'use client';

// External imports
import React from 'react';
import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {/* Home breadcrumb */}
        <li className="inline-flex items-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        
        {/* Dynamic breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors md:ml-2"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
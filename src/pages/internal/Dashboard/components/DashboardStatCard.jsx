import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '@/components/charts/LineChart';
import { createChartAreaGradient } from '@/components/charts/config/chartUtils';
import EditMenu from '@/components/ui/Dropdown/DropdownEditMenu';

// Import utilities
import { adjustColorOpacity } from '@/utils/colorUtils';
import { getCSSVariable } from '@/utils/domUtils';

function DashboardStatCard({data}) {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{data.title}</h2>
          {/* Menu button */}
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                {data.links.link1Text}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                {data.links.link2Text}
              </Link>
            </li>
          </EditMenu>
        </header>

        {/* <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Sales</div> */}
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{data.value}</div>
          <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">{data.percentage}</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStatCard;

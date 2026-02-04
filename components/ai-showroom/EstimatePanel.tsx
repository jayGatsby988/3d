'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, ChevronUp, Clock, MessageCircle, TrendingUp } from 'lucide-react';
import useShowroomStore from '@/lib/showroomStore';
import { getDefaultSettings, calculateEstimate } from '@/lib/estimator';
import { formatCurrency, formatRange, formatDelta } from '@/lib/format';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

type EstimatePanelProps = {
  onOpenAIChat?: () => void;
};

export default function EstimatePanel({ onOpenAIChat }: EstimatePanelProps) {
  const { estimate } = useShowroomStore();
  const [showBreakdown, setShowBreakdown] = useState(true);

  const { deltaLow, deltaHigh, materialsRange, laborRange } = useMemo(() => {
    const defaultSettings = getDefaultSettings();
    const defaultEst = calculateEstimate(defaultSettings);
    const deltaLow = estimate.totalLow - defaultEst.totalLow;
    const deltaHigh = estimate.totalHigh - defaultEst.totalHigh;
    const materialsLow = estimate.lineItems.reduce((s, i) => s + i.materialsLow, 0);
    const materialsHigh = estimate.lineItems.reduce((s, i) => s + i.materialsHigh, 0);
    const laborLow = estimate.lineItems.reduce((s, i) => s + i.laborLow, 0);
    const laborHigh = estimate.lineItems.reduce((s, i) => s + i.laborHigh, 0);
    return {
      deltaLow,
      deltaHigh,
      materialsRange: { low: materialsLow, high: materialsHigh },
      laborRange: { low: laborLow, high: laborHigh },
    };
  }, [estimate]);

  const hasDelta = deltaLow !== 0 || deltaHigh !== 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sticky top-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Project Estimate</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Estimates are based on your selections and typical site conditions.
                  Final pricing after measurements and site review.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <motion.div
          className="text-4xl font-bold text-gray-900"
          key={`${estimate.totalLow}-${estimate.totalHigh}`}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatRange(estimate.totalLow, estimate.totalHigh)}
        </motion.div>

        {hasDelta && (
          <div className="flex items-center gap-2 mt-2 text-sm text-emerald-700 font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>
              vs base config: {formatDelta(deltaLow)} to {formatDelta(deltaHigh)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-gray-50 rounded-lg text-xs">
          <div>
            <span className="text-gray-500">Materials</span>
            <div className="font-medium text-gray-900">{formatRange(materialsRange.low, materialsRange.high)}</div>
          </div>
          <div>
            <span className="text-gray-500">Labor</span>
            <div className="font-medium text-gray-900">{formatRange(laborRange.low, laborRange.high)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            {estimate.timelineLow}–{estimate.timelineHigh} weeks
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span>Line Item Breakdown</span>
          {showBreakdown ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
                {estimate.lineItems.map((item, index) => (
                  <motion.div
                    key={item.category}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {item.category}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatRange(item.totalLow, item.totalHigh)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {item.materialsLow + item.materialsHigh > 0 && (
                        <div className="flex justify-between">
                          <span>Materials:</span>
                          <span>{formatRange(item.materialsLow, item.materialsHigh)}</span>
                        </div>
                      )}
                      {item.laborLow + item.laborHigh > 0 && (
                        <div className="flex justify-between">
                          <span>Labor:</span>
                          <span>{formatRange(item.laborLow, item.laborHigh)}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="explain" className="border-none">
          <AccordionTrigger className="text-sm text-gray-600 hover:text-gray-900 py-2">
            Explain this estimate
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-600 space-y-2 pb-4">
            <p>
              This estimate is calculated based on your material selections, room
              dimensions, and typical labor rates in your region.
            </p>
            <p className="font-medium text-gray-700 mt-2">Factors considered:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Cabinet linear footage and height</li>
              <li>Countertop square footage</li>
              <li>Material quality tier</li>
              <li>Labor complexity</li>
              <li>Standard allowances for utilities</li>
            </ul>
            <p className="font-medium text-gray-700 mt-3">What can change:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Site-specific conditions</li>
              <li>Structural modifications</li>
              <li>Permit requirements</li>
              <li>Material availability</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {onOpenAIChat && (
        <Button
          variant="outline"
          className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
          size="sm"
          onClick={onOpenAIChat}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask AI or get consultation summary
        </Button>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-900">
          <strong>Disclaimer:</strong> This is an estimate, not a final quote. Final
          pricing determined after measurements and site review.
        </p>
      </div>
    </div>
  );
}

// File: app/components/QuestionCard.tsx

'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { truncateText } from '../utils/textUtils';

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    time: string;
    category: string;
    district: string;
    answers: number;
    name?: string;
    nickname: string;
    isClosed?: boolean;
  };
  onReportClick: (id: string) => void;
}

export default function QuestionCard({ question, onReportClick }: QuestionCardProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  // Get simple preview for question card
  const preview = truncateText(question.title, 80);

  const isNew = () => {
    if (!question.time || typeof question.time !== 'string') return false;

    const timeParts = question.time.toLowerCase().split(' ');
    if (timeParts.length < 2) return false;

    const value = parseInt(timeParts[0]);
    const unit = timeParts[1];

    if (!unit) return false;

    if (unit.includes(t('filters.minutes')) || unit.includes(t('filters.hours'))) return true;
    if (unit.includes(t('filters.days')) && !isNaN(value) && value < 1) return true;

    return false;
  };

  const isPopular = () => question.answers >= 7;

  const getTitleWithIcons = () => {
    let displayTitle = question.title;
    displayTitle = displayTitle.replace(/^[^\w\s]*\s*/g, '');

    const icons = [];
    if (isNew()) icons.push('🆕');
    if (isPopular()) icons.push('🔥');

    return icons.length > 0 ? `${icons.join(' ')} ${displayTitle}` : displayTitle;
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 ${
        isHovered 
          ? 'shadow-lg scale-[1.01] border-purple-200' 
          : 'border-gray-100 shadow-sm hover:shadow-lg' 
      }`}
      onMouseEnter={() => setIsHovered(true)}   
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        {/* Title Section */}
        <div className="relative mb-3">
          <h3 
            className="text-base font-medium text-gray-900 transition-all duration-300 line-clamp-1"
            title={getTitleWithIcons().replace(/^[^\w\s]*\s*/g, '')}
          >
            {truncateText(getTitleWithIcons().replace(/^[^\w\s]*\s*/g, ''), 80)}
          </h3>
        </div>

        {/* Info Bar */}
        <div className="flex items-center justify-between">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg transition-all group-hover:bg-purple-100">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
              {t(`filters.${question.category.toLowerCase()}`, { defaultValue: question.category })}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition-all group-hover:bg-blue-100">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {t(`filters.${question.district.toLowerCase()}`, { defaultValue: question.district })}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg transition-all group-hover:bg-gray-100">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {question.answers} {t('answers', { defaultValue: 'answers' })}
            </span>
          </div>

          {/* Report Button */}
          <button
            onClick={() => onReportClick(question.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-gray-400 hover:text-red-500"
            title={t('report', { defaultValue: 'Report' })}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </button>
        </div>

        {/* Time and Author */}
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{question.time}</span>
          <span>{question.nickname}</span>
        </div>
      </div>
    </div>
  );
}
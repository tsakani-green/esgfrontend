import React from 'react';
import ReportGenerator from './ReportGenerator';

export default function ReportsTab({ surfaceCard, onExport }) {
  console.log('ReportsTab rendering with surfaceCard:', surfaceCard);
  
  return <ReportGenerator surfaceCard={surfaceCard} />;
}

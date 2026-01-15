/**
 * ExportDropdown Component
 * A dropdown for exporting statistics data in various formats
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadIcon, FileTextIcon, TableIcon } from '@shared/components/icons';
import dayjs from 'dayjs';

interface ExportData {
  totalRevenue: number;
  totalBookings: number;
  avgPerBooking: number;
  newClients: number;
  topClients: { name: string; totalSpent: number; bookingsCount: number; lastVisit: string }[];
  revenueByPeriod: { monthly: number[]; weekly: number[]; daily: number[] };
  dateRange: { startDate: Date; endDate: Date; label: string };
}

interface ExportDropdownProps {
  data: ExportData;
  studioName: string;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ data, studioName }) => {
  const { t } = useTranslation('merchantStats');
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateCSV = () => {
    const rows: string[][] = [];
    const dateLabel = data.dateRange.label;

    // Header
    rows.push([t('export.reportTitle'), studioName]);
    rows.push([t('export.period'), dateLabel]);
    rows.push([t('export.generatedAt'), dayjs().format('DD/MM/YYYY HH:mm')]);
    rows.push([]);

    // Main metrics
    rows.push([t('export.mainMetrics')]);
    rows.push([t('metrics.totalRevenue'), `₪${data.totalRevenue.toLocaleString()}`]);
    rows.push([t('metrics.totalBookings'), String(data.totalBookings)]);
    rows.push([t('metrics.avgPerBooking'), `₪${data.avgPerBooking}`]);
    rows.push([t('metrics.newClients'), String(data.newClients)]);
    rows.push([]);

    // Top clients
    if (data.topClients?.length > 0) {
      rows.push([t('export.topClients')]);
      rows.push([t('clients.name'), t('clients.totalSpent'), t('clients.bookingsCount'), t('clients.lastVisit')]);
      data.topClients.forEach(client => {
        rows.push([
          client.name,
          `₪${client.totalSpent.toLocaleString()}`,
          String(client.bookingsCount),
          client.lastVisit
        ]);
      });
      rows.push([]);
    }

    // Monthly revenue
    if (data.revenueByPeriod?.monthly?.length > 0) {
      rows.push([t('export.monthlyRevenue')]);
      const months = [];
      for (let i = 11; i >= 0; i--) {
        months.push(dayjs().subtract(i, 'month').format('MM/YYYY'));
      }
      rows.push([t('export.month'), ...months]);
      rows.push([t('export.revenue'), ...data.revenueByPeriod.monthly.map(v => `₪${v.toLocaleString()}`)]);
    }

    // Convert to CSV string
    const csvContent = rows.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    return csvContent;
  };

  const downloadCSV = () => {
    setIsExporting(true);
    try {
      const csvContent = generateCSV();
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statistics_${studioName}_${dayjs().format('YYYY-MM-DD')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const generatePDFContent = () => {
    // Generate an HTML string that can be printed to PDF
    const dateLabel = data.dateRange.label;

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <title>${t('export.reportTitle')} - ${studioName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            direction: rtl;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          h2 {
            color: #555;
            margin-top: 30px;
          }
          .meta {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
          }
          .metric-card {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
          }
          .metric-card .value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .metric-card .label {
            color: #666;
            margin-top: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px;
            text-align: right;
            border-bottom: 1px solid #ddd;
          }
          th {
            background: #667eea;
            color: white;
          }
          tr:nth-child(even) {
            background: #f9f9f9;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h1>${t('export.reportTitle')} - ${studioName}</h1>
        <div class="meta">
          <p>${t('export.period')}: ${dateLabel}</p>
          <p>${t('export.generatedAt')}: ${dayjs().format('DD/MM/YYYY HH:mm')}</p>
        </div>

        <h2>${t('export.mainMetrics')}</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="value">₪${data.totalRevenue.toLocaleString()}</div>
            <div class="label">${t('metrics.totalRevenue')}</div>
          </div>
          <div class="metric-card">
            <div class="value">${data.totalBookings}</div>
            <div class="label">${t('metrics.totalBookings')}</div>
          </div>
          <div class="metric-card">
            <div class="value">₪${data.avgPerBooking}</div>
            <div class="label">${t('metrics.avgPerBooking')}</div>
          </div>
          <div class="metric-card">
            <div class="value">${data.newClients}</div>
            <div class="label">${t('metrics.newClients')}</div>
          </div>
        </div>

        ${data.topClients?.length > 0 ? `
          <h2>${t('export.topClients')}</h2>
          <table>
            <thead>
              <tr>
                <th>${t('clients.name')}</th>
                <th>${t('clients.totalSpent')}</th>
                <th>${t('clients.bookingsCount')}</th>
                <th>${t('clients.lastVisit')}</th>
              </tr>
            </thead>
            <tbody>
              ${data.topClients.map(client => `
                <tr>
                  <td>${client.name}</td>
                  <td>₪${client.totalSpent.toLocaleString()}</td>
                  <td>${client.bookingsCount}</td>
                  <td>${client.lastVisit}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        <div class="footer">
          <p>${t('export.generatedBy')} | ${dayjs().format('DD/MM/YYYY HH:mm')}</p>
        </div>
      </body>
      </html>
    `;
  };

  const downloadPDF = () => {
    setIsExporting(true);
    try {
      const htmlContent = generatePDFContent();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        // Allow time for styles to load
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="export-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="export-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        title={t('export.title')}
      >
        <DownloadIcon />
      </button>

      {isOpen && (
        <div className="export-dropdown__menu">
          <button
            type="button"
            className="export-dropdown__item"
            onClick={downloadCSV}
          >
            <TableIcon />
            <span>{t('export.csv')}</span>
          </button>
          <button
            type="button"
            className="export-dropdown__item"
            onClick={downloadPDF}
          >
            <FileTextIcon />
            <span>{t('export.pdf')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;

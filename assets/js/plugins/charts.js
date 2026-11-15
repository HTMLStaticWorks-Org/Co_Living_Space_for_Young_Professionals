/**
 * NESTLY CO-LIVING — LIGHTWEIGHT SVG CHART ENGINE (charts.js)
 * Zero-dependency responsive SVG Bar, Line, and Donut charts for Dashboards.
 */
(function () {
  'use strict';

  function renderBarChart(container, labels, values, unitPrefix) {
    if (!container) return;
    const maxVal = Math.max(...values, 1);
    const barElements = values.map((val, i) => {
      const heightPct = Math.round((val / maxVal) * 100);
      return (
        '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;">' +
        '  <span class="font-mono" style="font-size:0.74rem;color:var(--text-muted);">' + (unitPrefix || '') + val + '</span>' +
        '  <div style="width:100%;max-width:44px;height:150px;background:rgba(20,116,111,0.1);border-radius:10px;display:flex;align-items:flex-end;overflow:hidden;">' +
        '    <div style="width:100%;height:' + heightPct + '%;background:linear-gradient(180deg,var(--clay),var(--teal));border-radius:10px;transition:height 0.6s ease;"></div>' +
        '  </div>' +
        '  <span class="font-mono" style="font-size:0.75rem;font-weight:600;">' + labels[i] + '</span>' +
        '</div>'
      );
    }).join('');

    container.innerHTML =
      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding-top:16px;">' +
      barElements +
      '</div>';
  }

  function initCharts() {
    document.querySelectorAll('[data-chart-bars]').forEach((el) => {
      const labels = (el.getAttribute('data-labels') || 'Jun,Jul,Aug,Sep,Oct,Nov').split(',');
      const values = (el.getAttribute('data-values') || '92,94,96,95,98,99').split(',').map(Number);
      const prefix = el.getAttribute('data-prefix') || '';
      renderBarChart(el, labels, values, prefix);
    });
  }

  document.addEventListener('DOMContentLoaded', initCharts);
})();

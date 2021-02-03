import ExcelJS from 'exceljs';
import '/src/lib/file-saver/dist/FileSaver';

import { autoFitColumnWidth } from '/src/lib/excel/format';
import { compareBy } from '/src/lib/utils/array';

import Company from '/src/models/Company';
import Market from '/src/models/Market';

export async function simulationSaveToExcel(simulation) {
  // Workbook
  const workbook = new ExcelJS.Workbook();

  // Markets
  const markets = await Market.findAll({ parent: simulation, order: 'name' });

  // Companies
  const companies = await Company.findAll({
    parent: simulation,
    order: 'name',
  });
  const ownCompanies = companies.filter((it) => !it.isVirual);
  const virtualCompetitors = companies.filter((it) => it.isVirual);

  // For each Market
  for (let market of markets) {
    const worksheet = workbook.addWorksheet(market.username);

    worksheet.addRow([market.username]);

    const companies = [
      ...ownCompanies.filter((it) => it.marketId === market.id),
      ...virtualCompetitors.filter((it) => it.marketId === market.id),
    ];

    for (let company of companies) {
      let row;
      row = worksheet.addRow([company.name]);
      row.font = { bold: true };

      row = worksheet.addRow([
        'RoundNo',
        'Price',
        'Quantity',
        'Inventory',
        'Sales',
        'Revenue',
        'Cost of Production',
        'Inventory Holding Cost',
        'Total Cost',
        'Profit',
        'Cumulative Profit',
        'Market Share',
      ]);
      row.font = { bold: true };

      const situations = [...company.situations];
      situations.sort(compareBy('round'));

      for (let situation of situations) {
        row = worksheet.addRow([
          situation.round,
          situation.price,
          situation.quantity,
          situation.inventory,
          situation.sales,
          situation.revenue,
          situation.productionCost,
          situation.inventoryCost,
          situation.productionCost + situation.inventoryCost,
          situation.profit,
          situation.cumulativeProfit,
          situation.share,
        ]);

        row.getCell(3).numFmt = '#,##0';
        row.getCell(4).numFmt = '#,##0';
        row.getCell(5).numFmt = '#,##0';
        row.getCell(6).numFmt = '#,##0';
        row.getCell(7).numFmt = '#,##0';
        row.getCell(8).numFmt = '#,##0';
        row.getCell(9).numFmt = '#,##0';
        row.getCell(10).numFmt = '#,##0';
        row.getCell(11).numFmt = '#,##0';
      }
    }

    // ws.properties.defaultColWidth = 22;
    autoFitColumnWidth(worksheet);
  }

  const buf = await workbook.xlsx.writeBuffer();

  saveAs(new Blob([buf]), 'simulation.xlsx');
}

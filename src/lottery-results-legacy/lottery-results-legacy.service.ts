import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import * as mysql from 'mysql2/promise';

@Injectable()
export class LotteryResultsLegacyService {
  constructor(
    // injected mysql pool
    @Inject('MYSQL_POOL') private readonly pool: Pool,
  ) {}

  async getResultsByDateRange(from: string, to: string) {
    const [rows]: any = await this.pool.query(
      `
      SELECT id, draw, result, draw_number, grp, result_date, created_at
      FROM draws
      WHERE result_date BETWEEN ? AND ?
      ORDER BY result_date DESC
      `,
      [from, to],
    );

    const response: any[] = [];

    for (const row of rows) {
      const res1 = JSON.parse(row.result);

      if (!res1 || !Array.isArray(res1)) {
        response.push({ result_prety: [] });
        continue;
      }

      const joinedResult = res1.join('\n');

      response.push({
        id: String(row.id),
        title: row.draw.replace(/LOTTERY NO\.| DRAW|st|nd|th|rd/g, ''),
        result_prety: this.getPretyResult(joinedResult),
        draw_number: String(row.draw_number),
        grp: row.grp,
        result_date: this.formatDate(row.result_date),
        short_date: this.formatShortDate(row.result_date),
        created_at:
          row.created_at instanceof Date ? row.created_at.toISOString().slice(0, 19).replace('T', ' ') : row.created_at,
      });
    }

    return response;
  }

  private formatDate(date: string) {
    const d = new Date(date);

    const weekday = d.toLocaleString('en-GB', { weekday: 'short' });
    const day = d.toLocaleString('en-GB', { day: '2-digit' });
    const month = d.toLocaleString('en-GB', { month: 'short' });
    const year = d.toLocaleString('en-GB', { year: '2-digit' });

    return `${weekday} ${day}-${month}-${year}`;
  }

  private formatShortDate(date: string) {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  }

  private getPretyResult(content: string) {
    const pattern =
      /((?:1st|2nd|3rd|4th|5th|6th|7th|8th|9th|Cons) Prize[-\s]Rs\s*:\s*\d+\/-)\s*(.*?)(?=(?:1st|2nd|3rd|4th|5th|6th|7th|8th|9th|Cons) Prize[-\s]Rs\s*:\s*\d+\/-|$)/gis;

    const sixDigitPattern = /[A-Z]{2}\s\d{6}|\d{6}/g;
    const fourDigitPattern = /\b\d{4}\b/g;

    const matches = [...content.matchAll(pattern)];

    const allPrizeNumbers: any[] = [];

    for (const match of matches) {
      const prizeHead = match[1];
      const details = match[2];

      const sixDigits = details.match(sixDigitPattern) || [];
      const fourDigits = details.match(fourDigitPattern) || [];

      const prizeNumbers = [...sixDigits, ...fourDigits];

      allPrizeNumbers.push({
        prize_head: prizeHead,
        numbers: prizeNumbers,
      });
    }

    return JSON.stringify(allPrizeNumbers, null, 2);
  }
}

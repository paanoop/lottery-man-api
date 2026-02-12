import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class LotteryResultsService {
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
      const parsed = JSON.parse(row.result || '[]');

      if (!Array.isArray(parsed) || parsed.length === 0) {
        response.push({ results: [] });
        continue;
      }

      const joined = parsed.join('\n');

      response.push({
        draw_number: String(row.draw_number),
        grp: row.grp,
        result_date: String(row.result_date),
        created_at: new Date(row.created_at).toISOString(),
        results: this.getPretyResult(joined),
      });
    }

    return response;
  }

  private getPretyResult(content: string) {
    const prizePattern =
      /((?:1st|2nd|3rd|4th|5th|6th|7th|8th|9th|Cons) Prize[-\s]Rs\s*:\s*\d+\/-)\s*(.*?)(?=(?:1st|2nd|3rd|4th|5th|6th|7th|8th|9th|Cons) Prize[-\s]Rs\s*:\s*\d+\/-|$)/gis;

    const sixDigitPattern = /[A-Z]{2}\s\d{6}|\d{6}/g;
    const fourDigitPattern = /\b\d{4}\b/g;

    const placePattern = /\(([A-Z\s]+)\)/i;

    const nonPrizeLinePattern =
      /^\d{2}\/\d{2}\/\d{4}.*|Page\s+\d+|IT Support|NIC Kerala|Sd\/-|Joint Director|Directorate Of State Lotteries|GORKY BHAVAN|Government Gazette|winning tickets/i;

    const matches = [...content.matchAll(prizePattern)];

    const allPrizeNumbers: any[] = [];

    for (const match of matches) {
      const prizeHead = match[1];
      const details = match[2];

      let sixDigitNumbers: string[] = [];
      let fourDigitNumbers: string[] = [];
      let place: string | undefined;

      const lines = details.split(/\r\n|\r|\n/);

      for (const line of lines) {
        if (nonPrizeLinePattern.test(line)) {
          continue;
        }

        const placeMatch = line.match(placePattern);
        if (placeMatch && !place) {
          place = placeMatch[1].trim();
        }

        const sixMatches = line.match(sixDigitPattern);
        if (sixMatches) {
          sixDigitNumbers = sixDigitNumbers.concat(sixMatches);
        }

        const fourMatches = line.match(fourDigitPattern);
        if (fourMatches) {
          fourDigitNumbers = fourDigitNumbers.concat(fourMatches);
        }
      }

      // Same PHP logic
      if (
        fourDigitNumbers.length > 0 &&
        parseInt(fourDigitNumbers[fourDigitNumbers.length - 1]) <= new Date().getFullYear()
      ) {
        fourDigitNumbers.pop();
      }

      const prizeNumbers = [...sixDigitNumbers, ...fourDigitNumbers];

      const prizeObject: any = {
        prize_head: prizeHead,
        numbers: prizeNumbers,
      };

      // NEW: attach place only if exists
      if (place) {
        prizeObject.place = place;
      }

      allPrizeNumbers.push(prizeObject);
    }

    return allPrizeNumbers;
  }
}

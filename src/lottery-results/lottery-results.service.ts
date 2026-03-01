import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class LotteryResultsService {
  constructor(
    // injected mysql pool
    @Inject('MYSQL_POOL') private readonly pool: Pool,
  ) {}

  async getResultsByDateRange(from: string, to: string) {
    // TEMP: Force include 17–25 Feb 2026 due to ingestion issue
    const forcedFrom = '2026-02-17';
    const forcedTo = '2026-02-25';

    let effectiveFrom = from;
    let effectiveTo = to;

    // Expand range if needed
    if (new Date(from) > new Date(forcedFrom)) {
      effectiveFrom = forcedFrom;
    }

    if (new Date(to) < new Date(forcedTo)) {
      effectiveTo = forcedTo;
    }

    await this.backfillResultJson(effectiveFrom, effectiveTo);

    const [rows]: any = await this.pool.query(
      `
    SELECT id, draw_number, grp, result_date, created_at, result_json
    FROM draws
    WHERE result_date BETWEEN ? AND ?
    ORDER BY result_date DESC
    `,
      // [from, to],
      [effectiveFrom, effectiveTo],
    );

    return rows.map((row: any) => ({
      draw_number: String(row.draw_number),
      grp: row.grp,
      result_date: String(row.result_date),
      created_at: new Date(row.created_at).toISOString(),
      results: row.result_json ? JSON.parse(row.result_json) : [],
    }));
  }

  async backfillResultJson(from: string, to: string) {
    const [rows]: any = await this.pool.query(
      `
    SELECT id, result
    FROM draws
    WHERE result_date BETWEEN ? AND ?
    AND result_json IS NULL
    `,
      [from, to],
    );

    console.log('Backfilling count:', rows.length);

    for (const row of rows) {
      try {
        const raw = row.result ?? '[]';

        const safeResult = Buffer.from(raw, 'utf8')
          .toString('utf8')
          .replace(/[\u0000-\u001F]/g, (c) => {
            switch (c) {
              case '\n':
                return '\\n';
              case '\r':
                return '\\r';
              case '\t':
                return '\\t';
              default:
                return '';
            }
          });

        const parsed = JSON.parse(safeResult);
        const joined = parsed.join('\n');

        const generated = this.getPretyResult(joined);

        await this.pool.query(`UPDATE draws SET result_json = ? WHERE id = ?`, [JSON.stringify(generated), row.id]);

        console.log(`Backfilled result_json for id ${row.id}`);
      } catch (err) {
        console.error(`Failed to backfill id ${row.id}`, err);
      }
    }
  }

  private getPretyResult(content: string) {
    try {
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
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

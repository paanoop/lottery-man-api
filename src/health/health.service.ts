import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class HealthService {
  constructor(@Inject('MYSQL_POOL') private readonly pool: Pool) {}

  async getLatestMobileRelease() {
    const [rows]: any = await this.pool.query(
      `
      SELECT version, build_number, is_force_update
      FROM mobile_app_releases
      WHERE platform = 'android'
        AND release_type = 'production'
        AND is_active = 1
      ORDER BY build_number DESC
      LIMIT 1
      `,
    );

    return rows[0] || null;
  }

  async checkDatabase() {
    const start = Date.now();
    await this.pool.query('SELECT 1');
    return {
      status: 'healthy',
      responseTimeMs: Date.now() - start,
    };
  }

  async getMaxResultDate() {
    const [rows]: any = await this.pool.query(
      `
    SELECT MAX(result_date) as maxResultDate
    FROM draws
    `,
    );

    return rows[0]?.maxResultDate || null;
  }
}

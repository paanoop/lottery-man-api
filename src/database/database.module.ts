import { Module, Global } from '@nestjs/common';
import mysql from 'mysql2/promise';

@Global()
@Module({
  providers: [
    {
      provide: 'MYSQL_POOL',
      useFactory: async () => {
        const pool = mysql.createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          dateStrings: true,
        });

        return pool;
      },
    },
  ],
  exports: ['MYSQL_POOL'],
})
export class DatabaseModule {}

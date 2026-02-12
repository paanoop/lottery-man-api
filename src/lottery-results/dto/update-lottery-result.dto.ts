import { PartialType } from '@nestjs/swagger';
import { CreateLotteryResultDto } from './create-lottery-result.dto';

export class UpdateLotteryResultDto extends PartialType(CreateLotteryResultDto) {}

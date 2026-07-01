import { Type, Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';
import { normalizeOptionalText, normalizeText } from '../../common/text';

export class ProductVariantDto {
  @IsString()
  @MaxLength(80)
  @Transform(({ value }) => normalizeText(String(value ?? ''), 80))
  name: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  priceCop: number;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => normalizeText(String(value ?? ''), 100))
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Transform(({ value }) => normalizeOptionalText(value === undefined ? undefined : String(value), 60))
  icon?: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => normalizeOptionalText(value === undefined ? undefined : String(value), 100))
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Transform(({ value }) => normalizeOptionalText(value === undefined ? undefined : String(value), 60))
  icon?: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class CreateProductDto {
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => normalizeText(String(value ?? ''), 120))
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => normalizeOptionalText(value === undefined ? undefined : String(value), 500))
  description?: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  priceCop: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => normalizeOptionalText(value === undefined ? undefined : String(value), 120))
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => normalizeOptionalText(value === undefined ? undefined : String(value), 500))
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  priceCop?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateMenuMetaDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => normalizeOptionalText(value === undefined ? undefined : String(value), 120))
  brandName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => normalizeOptionalText(value === undefined ? undefined : String(value), 120))
  subtitle?: string;
}

export class ReorderCategoryDto {
  @IsString()
  categoryId: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder: number;
}

export class ReorderProductDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder: number;
}

export class ReorderMenuDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(40)
  @ValidateNested({ each: true })
  @Type(() => ReorderCategoryDto)
  categories?: ReorderCategoryDto[];

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(120)
  @ValidateNested({ each: true })
  @Type(() => ReorderProductDto)
  products?: ReorderProductDto[];
}


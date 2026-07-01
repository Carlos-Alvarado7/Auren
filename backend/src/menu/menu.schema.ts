import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MenuDocument = HydratedDocument<Menu>;

@Schema({ _id: false })
export class MenuProductVariant {
  @Prop({ required: true, trim: true, maxlength: 80 })
  name: string;

  @Prop({ required: true, min: 0 })
  priceCop: number;

  @Prop({ required: true, default: true })
  visible: boolean;

  @Prop({ required: true, default: 0 })
  sortOrder: number;
}

export const MenuProductVariantSchema = SchemaFactory.createForClass(MenuProductVariant);

@Schema({ _id: true })
export class MenuProduct {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 120 })
  name: string;

  @Prop({ trim: true, maxlength: 500 })
  description?: string;

  @Prop({ required: true, min: 0 })
  priceCop: number;

  @Prop({ type: [MenuProductVariantSchema], default: [] })
  variants: MenuProductVariant[];

  @Prop({ required: true, default: true })
  visible: boolean;

  @Prop({ required: true, default: true })
  available: boolean;

  @Prop({ required: true, default: 0 })
  sortOrder: number;
}

export const MenuProductSchema = SchemaFactory.createForClass(MenuProduct);

@Schema({ _id: true })
export class MenuCategory {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 100 })
  title: string;

  @Prop({ trim: true, maxlength: 60 })
  icon?: string;

  @Prop({ required: true, default: true })
  visible: boolean;

  @Prop({ required: true, default: 0 })
  sortOrder: number;

  @Prop({ type: [MenuProductSchema], default: [] })
  products: MenuProduct[];
}

export const MenuCategorySchema = SchemaFactory.createForClass(MenuCategory);

@Schema({ _id: false })
export class MenuVersion {
  @Prop({ required: true, trim: true, maxlength: 120 })
  brandName: string;

  @Prop({ required: true, trim: true, maxlength: 120 })
  subtitle: string;

  @Prop({ type: [MenuCategorySchema], default: [] })
  categories: MenuCategory[];
}

export const MenuVersionSchema = SchemaFactory.createForClass(MenuVersion);

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true, unique: true, trim: true, lowercase: true, maxlength: 80 })
  slug: string;

  @Prop({ type: MenuVersionSchema, required: true })
  draft: MenuVersion;

  @Prop({ type: MenuVersionSchema, required: true })
  published: MenuVersion;

  @Prop()
  publishedAt?: Date;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

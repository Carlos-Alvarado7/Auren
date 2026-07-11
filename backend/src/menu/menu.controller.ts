import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthGuard, getAuthenticatedAdmin } from '../auth/admin-auth.guard';
import { AuditService } from '../audit/audit.service';
import {
  CreateCategoryDto,
  CreateProductDto,
  ReorderMenuDto,
  UpdateCategoryDto,
  UpdateMenuMetaDto,
  UpdateProductDto
} from './dto/menu.dto';
import { DEFAULT_MENU_SLUG } from './menu.defaults';
import { MenuService } from './menu.service';
import { PublicMenuResponse } from './menu.presenter';
import { MenuDocument } from './menu.schema';

@Controller('menu')
export class PublicMenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get(':slug')
  @Header('Cache-Control', 'public, max-age=0, must-revalidate')
  getPublicMenu(@Param('slug') slug: string): Promise<PublicMenuResponse> {
    return this.menuService.getPublicMenu(slug);
  }
}

@Controller('admin/menu')
@UseGuards(AdminAuthGuard)
export class AdminMenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly auditService: AuditService
  ) {}

  @Get()
  getMenu(): Promise<MenuDocument> {
    return this.menuService.getAdminMenu(DEFAULT_MENU_SLUG);
  }

  @Patch('meta')
  async updateMeta(@Body() dto: UpdateMenuMetaDto, @Req() request: Request): Promise<MenuDocument> {
    const menu = await this.menuService.updateMeta(dto);
    await this.record(request, 'menu.meta.updated', 'menu', menu._id.toString());
    return menu;
  }

  @Post('categories')
  async createCategory(@Body() dto: CreateCategoryDto, @Req() request: Request): Promise<MenuDocument> {
    const menu = await this.menuService.createCategory(dto);
    await this.record(request, 'category.created', 'category', undefined, { title: dto.title });
    return menu;
  }

  @Patch('categories/:categoryId')
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateCategoryDto,
    @Req() request: Request
  ): Promise<MenuDocument> {
    const menu = await this.menuService.updateCategory(categoryId, dto);
    await this.record(request, 'category.updated', 'category', categoryId);
    return menu;
  }

  @Delete('categories/:categoryId')
  async deleteCategory(@Param('categoryId') categoryId: string, @Req() request: Request): Promise<MenuDocument> {
    const menu = await this.menuService.deleteCategory(categoryId);
    await this.record(request, 'category.deleted', 'category', categoryId);
    return menu;
  }

  @Post('categories/:categoryId/products')
  async createProduct(
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateProductDto,
    @Req() request: Request
  ): Promise<MenuDocument> {
    const menu = await this.menuService.createProduct(categoryId, dto);
    await this.record(request, 'product.created', 'product', undefined, { categoryId, name: dto.name });
    return menu;
  }

  @Patch('categories/:categoryId/products/:productId')
  async updateProduct(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
    @Req() request: Request
  ): Promise<MenuDocument> {
    const menu = await this.menuService.updateProduct(categoryId, productId, dto);
    await this.record(request, 'product.updated', 'product', productId, { categoryId });
    return menu;
  }

  @Delete('categories/:categoryId/products/:productId')
  async deleteProduct(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
    @Req() request: Request
  ): Promise<MenuDocument> {
    const menu = await this.menuService.deleteProduct(categoryId, productId);
    await this.record(request, 'product.deleted', 'product', productId, { categoryId });
    return menu;
  }

  @Patch('reorder')
  async reorder(@Body() dto: ReorderMenuDto, @Req() request: Request): Promise<MenuDocument> {
    const menu = await this.menuService.reorder(dto);
    await this.record(request, 'menu.reordered', 'menu', menu._id.toString());
    return menu;
  }

  @Post('publish')
  async publish(@Req() request: Request): Promise<MenuDocument> {
    const menu = await this.menuService.publish();
    await this.record(request, 'menu.published', 'menu', menu._id.toString());
    return menu;
  }

  private record(
    request: Request,
    action: string,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const admin = getAuthenticatedAdmin(request);
    return this.auditService.record({
      action,
      actorEmail: admin.email,
      entityType,
      entityId,
      metadata
    });
  }
}

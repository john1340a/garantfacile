import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a document for watermarking' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR || './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  upload(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: (() => {
              const v = parseInt(process.env.MAX_FILE_SIZE, 10);
              return !isNaN(v) && v > 0 ? v : 10485760;
            })(),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.upload(req.user.id, file, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List my documents' })
  findAll(@Request() req) {
    return this.documentsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.documentsService.findOne(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  delete(@Request() req, @Param('id') id: string) {
    return this.documentsService.delete(id, req.user.id);
  }
}

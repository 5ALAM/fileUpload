import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CoreService } from '../core/core.service';
import { fileUploadService } from './fileUpload.service';

@Controller('fileUpload')
export class fileUploadController {
  constructor(
    private readonly fileUploadService: fileUploadService,
    private readonly core: CoreService,
  ) {}

  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets',
      }),
    }),
  )
  async csvConverter(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'csv',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file?: Express.Multer.File,
  ) {
    try {
      let res = await this.fileUploadService.csvConverter(file);
      console.log('inresponse', res);

      return this.core.frameResponse(res, 200, 'Users Uploaded Successfully');
    } catch (error) {
      return this.core.frameResponse(
        { err: error },
        422,
        'Failed to Upload Users',
      );
    }
  }
}

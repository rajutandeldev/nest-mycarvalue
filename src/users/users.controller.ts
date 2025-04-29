import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
} from "@nestjs/common";
import { UserValidationDto } from "./dto/UserValidation.dtos";
import { UsersService } from "./users.service";
import { Response } from "express";
import { CustomExceptions } from "src/customExceptions/customExceptions";

@Controller("auth")
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post("signup")
  async createUser(@Body() body: UserValidationDto, @Res() res: Response) {
    let logger = new Logger();
    logger.log(`Req | ${JSON.stringify(body)} `);
    const response = await this.userService.create(body.email, body.password);
    logger.log(`service reponse | ${JSON.stringify(response)}`);
    if ('status' in response) {
      if(response?.status == HttpStatus.FOUND){
           throw new CustomExceptions(response);
      }
      throw new InternalServerErrorException(`User not created`);
    }
    return res
      .status(HttpStatus.CREATED)
      .send({
        status: HttpStatus.CREATED,
        data: `User account created successfully`,
      });
  }
}

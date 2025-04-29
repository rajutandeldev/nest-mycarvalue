import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
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
        data:response,
        message: `User account created successfully`,
      });
  } 

  @Get(':id')
  findUser(@Param('id') id:number){
     return this.userService.findOne(id)
  }
  
  @Get()
  findAllUser(@Query('email') email:string){
      console.log('emailemail',email)
      return this.userService.find(email)
  }

  @Patch(':id')
  updateUser(@Param('id') id:number, @Body() body){
    return this.userService.update(id,body)
  }

  @Delete(':id')
  removeUser(@Param('id') id:number){
      return this.userService.remove(id)
  }

}

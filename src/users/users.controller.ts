import {
  BadRequestException,
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
  Req,
  Res,

  Session,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserValidationDto } from "./dto/UserValidation.dtos";
import { UsersService } from "./users.service";
import { CustomExceptions } from "src/customExceptions/customExceptions";
import { Serialize, SerializeInterceptor } from "src/interceptors/serialize.interceptor";
import { UserDto } from "./dto/UserDtos";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "./users.entity";
import { CurrentUserInterceptor } from "./interceptor/current-user.interceptor";
import { AuthGuard } from "src/guards/auth.guads";
@Controller("auth")
// this will apply for all the path
@Serialize(UserDto)
// using interceptor like this we can use direction by defining in module
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(private userService: UsersService, private authService: AuthService) {}
  @Post("signup")
  async createUser(@Body() body: UserValidationDto, @Res({passthrough:true}) res: Response) {
    let logger = new Logger();
    logger.log(`Req | ${JSON.stringify(body)} `);
    const response = await this.authService.signup(body.email,body.password);
    console.log(response)
    return response
    // const response = await this.userService.create(body.email, body.password);
    // logger.log(`service reponse | ${JSON.stringify(response)}`);
    // if ('status' in response) {
    //   if(response?.status == HttpStatus.FOUND){
    //        throw new CustomExceptions(response);
    //   }
    //   throw new InternalServerErrorException(`User not created`);
    // }
    // return res
    //   .status(HttpStatus.CREATED)
    //   .send({
    //     status: HttpStatus.CREATED,
    //     data:response,
    //     message: `User account created successfully`,
    //   });
  } 
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  //Post refactor
  // we can add interceptor particularly to endpoint or in root
  // @Serialize(UserDto)
  // @Serialize(UserDto)
  @Post("signin")
  async singIn(@Body() body: UserValidationDto, @Res({passthrough:true}) res: Response, @Session() session:any){
    const response =await this.authService.signIn(body.email,body.password)
    console.log("response",response)
    session.userId = response.id
    return response;
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
  @Get('/whoami/me')
  @UseGuards(AuthGuard)
  async all(@Req() req:any,@Session() session:Record<string, any>){
    const logger = new Logger()
    logger.log(`session ${JSON.stringify(session)}`)
    const found = await this.userService.findOne(session.userId)
    if(!found){
      throw new BadRequestException("User singed out")
    }
    console.log('session',session.userId,'foundme',found)
    return found
  }

  @Get('whoami/getUser')
  whoAmI(@CurrentUser() user:User){
    return user
  }


  @Post('signout')
async signOut(@Session() session: any, @Res() res: Response) {
  session.userId= null
  res.status(HttpStatus.ACCEPTED).send({ message: "Signed out" });
}



}

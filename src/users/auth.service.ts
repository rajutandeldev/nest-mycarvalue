import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt} from "crypto";
import { promisify } from "util";
import { User } from "./users.entity";

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}
    
    async signup(email:string, password: string){
     const users = await this.usersService.find(email)
     console.log("users length",users.length)
     if(users.length){
        throw new BadRequestException("Email in use")
     }
     const salt = randomBytes(9).toString('hex')
     const hash = (await scrypt(password,salt,32)) as Buffer;
     
     const result = salt+ '.'+hash.toString('hex')
     const user =await this.usersService.create(email,result)
     console.log('user==>',user)
     return user;
    }

    async signIn(email:string, password:string){
        const [users] = await this.usersService.find(email)
     console.log("users length",users)
     if(!users){
        throw new NotFoundException("User Not found")
     }
      
     const [salt,storedHash] = users.password.split('.');
     const hash = (await scrypt(password,salt,32)) as Buffer;
     
     if(storedHash !== hash.toString('hex')){
        throw new BadRequestException("Wrong password")
     }
     return users;
}

}

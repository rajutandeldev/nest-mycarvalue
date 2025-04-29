import { HttpCode, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) public repo: Repository<User>) {}
  async create(email: string, password: string) {
    const logger = new Logger()
    const findRecord = await this.repo.findOne({where:{email}});
    if(findRecord?.email){
       return {status:HttpStatus.FOUND, message: `User account already exist`}
    }
    logger.log(`findRecord | ${JSON.stringify(findRecord)}`)
    let response = await this.repo.create({ email, password });
    return this.repo.save(response);
  }
}

import { HttpCode, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { ObjectId, Repository } from "typeorm";

const logger = new Logger()

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) public repo: Repository<User>) {}
  async create(email: string, password: string) {
    const findRecord = await this.repo.findOne({where:{email}});
    if(findRecord?.email){
       return {status:HttpStatus.FOUND, message: `User account already exist`}
    }
    logger.log(`findRecord | ${JSON.stringify(findRecord)}`)
    let response = await this.repo.create({ email, password });
    return this.repo.save(response);
  }

  async findOne(id:number){
    logger.log(`id | ${id}`)
    const findRecord = await this.repo.findOne({where:{id}})
    logger.log(`findRecord | ${JSON.stringify(findRecord)}`)
    return findRecord

}

  async find(email:string){
    const findRecord = await this.repo.find({where:{email}});
    logger.log(`findRecord | ${JSON.stringify(findRecord)}`)
    return findRecord

  }

  async update(id:number, attr:Partial<User>){
    const user =await this.findOne(id);
    if(!user){
        throw new Error('User Not Found')
    }
    Object.assign(user,attr)
    logger.log(`findRecord | ${JSON.stringify(user)}`)
    return this.repo.save(user)
  }

  async remove(id:number){
    const user = await this.findOne(id);
    if(!user){
        throw new Error(`User not found`)
    }
    return this.repo.remove(user)
  }
}

import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
    UseInterceptors
} from '@nestjs/common'

import { UsersService } from '../users.service'

@Injectable()
// fetching the user for fectching session using Interceptor
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private userSevice:UsersService){}

    async intercept(context: ExecutionContext, handler: CallHandler<any>){
        const request = context.switchToHttp().getRequest()
        const {UserId} = request.session;
        if(UserId){
            const user = await this.userSevice.findOne(UserId)
            request.currentUser = user
        }
        return handler.handle()
    }
}